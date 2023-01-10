import {
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
} from "@zjs-tix/ticketingms-common-ts";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
	"/api/orders/:orderId",
	requireAuth,
	[
		body("orderId")
			.notEmpty()
			.custom((value) => mongoose.Types.ObjectId.isValid(value))
			.withMessage("Order Id must be valid"),
	],
	async (req: Request, res: Response) => {
		const { orderId } = req.params;

		const order = await Order.findById(orderId).populate("ticket");

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
			version: order.version,
			ticket: {
				id: order.ticket.id,
			},
		});

		res.status(204).send(order);
	},
);

export { router as deleteOrderRouter };
