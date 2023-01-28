import mongoose, { Types } from "mongoose";
import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from "@zjs-tix/ticketingms-common-ts";
import express, { Request, Response } from "express";
import { body, checkSchema } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOWS_SECONDS = 1 * 60;

router.post(
	"/api/orders",
	requireAuth,
	checkSchema({
		tickets: {
			isArray: true,
			notEmpty: true,
			errorMessage: "Tickets must be provided",
		},
		"tickets.*": {
			custom: {
				options: (value) => {
					return Types.ObjectId.isValid(value);
				},
			},
			errorMessage: "A Ticket Id is invalid",
		},
	}),
	validateRequest,
	async (req: Request, res: Response) => {
		const { tickets }: { tickets: string[] } = req.body;

		const matchingTickets = await Ticket.find({
			_id: {
				$in: tickets,
			},
		});

		// Find if tickets exists
		if (!(matchingTickets.length > 0)) {
			throw new NotFoundError();
		}

		for (const ticket of matchingTickets) {
			// Find if ticket is reserved in another order
			const isReserved = await ticket.isReserved();
			if (isReserved) {
				throw new BadRequestError("A ticket is already reserved");
			}
		}

		// Calculate order expiration date
		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS);

		// Create a record
		const order = new Order({
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			tickets: matchingTickets,
		});

		await order.save();

		// Publish order:created event
		new OrderCreatedPublisher(natsWrapper.client).publish({
			id: order.id,
			version: order.get("version"),
			status: order.status,
			userId: order.userId,
			expiresAt: order.expiresAt.toISOString(),
			tickets: order.tickets.map((ticket) => {
				return {
					id: ticket.id,
					price: ticket.price,
				};
			}),
		});

		res.status(201).send({ data: order });
	},
);

export { router as createOrderRouter };
