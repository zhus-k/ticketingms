import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import {
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
} from "@zjs-tix/ticketingms-common-ts";
import express, { Request, Response } from "express";
import { checkSchema } from "express-validator";
import { Types } from "mongoose";

const router = express.Router();

router.delete(
	"/api/orders/:orderId",
	requireAuth,
	checkSchema({
		orderId: {
			notEmpty: true,
			custom: { options: (value) => Types.ObjectId.isValid(value) },
			errorMessage: "Order Id is not valid",
		},
	}),
	async (req: Request, res: Response) => {
		const { orderId } = req.params;

		const order = await Order.findById(orderId).populate("tickets");

		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		order.status = OrderStatus.Cancelled;
		order.save();

		// publish order:cancelled event
		new OrderCancelledPublisher(natsWrapper.client).publish({
			id: order.id,
			version: order.get("version"),
			tickets: order.tickets.map((ticket) => {
				return { id: ticket.id };
			}),
		});

		res.status(204).send({ data: order });
	},
);

export { router as deleteOrderRouter };
