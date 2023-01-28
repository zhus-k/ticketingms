import { Order } from "../models/order";
import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from "@zjs-tix/ticketingms-common-ts";
import express, { Request, Response } from "express";
import { checkSchema } from "express-validator";
import { Types } from "mongoose";

const router = express.Router();

router.get(
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
		const order = await Order.findById(req.params.orderId)
			.populate("tickets")
			.lean({ virtuals: true });

		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		res.send({ data: order });
	},
);

export { router as showOrderRouter };
