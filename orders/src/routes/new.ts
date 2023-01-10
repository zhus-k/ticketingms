import mongoose from "mongoose";
import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from "@zjs-tix/ticketingms-common-ts";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOWS_SECONDS = 1 * 60;

router.post(
	"/api/orders",
	requireAuth,
	[
		body("ticketId")
			.notEmpty()
			.custom((value) => {
				return mongoose.Types.ObjectId.isValid(value);
			})
			.withMessage("TicketId must be provided"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;

		const ticket = await Ticket.findById(ticketId);

		// Find if ticket exists
		if (!ticket) {
			throw new NotFoundError();
		}

		// Find if ticket is reserved in another order
		const isReserved = await ticket.isReserved();
		if (isReserved) {
			throw new BadRequestError("Ticket is already reserved");
		}

		// Calculate order expiration date
		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS);

		// Create a record
		const order = Order.build({
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			ticket: ticket,
		});

		await order.save();

		// Publish order:created event
		new OrderCreatedPublisher(natsWrapper.client).publish({
			id: order.id,
			version: order.version,
			status: order.status,
			userId: order.userId,
			expiresAt: order.expiresAt.toISOString(),
			ticket: {
				id: ticket.id,
				price: ticket.price,
			},
		});

		res.status(201).send(order);
	},
);

export { router as createOrderRouter };
