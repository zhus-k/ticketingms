import { NotAuthorizedError, NotFoundError, requireAuth } from "common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../models/order";

const router = express.Router();

router.get(
	"/api/orders/:orderId",
	requireAuth,
	[
		body("orderId")
			.notEmpty()
			.custom((value) => {
				return mongoose.Types.ObjectId.isValid(value);
			})
			.withMessage("TicketId must be valid"),
	],
	async (req: Request, res: Response) => {
		const order = await Order.findById(req.params.orderId).populate("ticket");

		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		res.send(order);
	},
);

export { router as showOrderRouter };
