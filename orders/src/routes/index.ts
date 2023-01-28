import { Order } from "../models/order";
import { requireAuth } from "@zjs-tix/ticketingms-common-ts";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
	const [{ meta, data }] = await Order.aggregate([
		{ $match: { userId: req.currentUser!.id } },
		{ $sort: { createdAt: -1 } },
		{ $skip: 0 },
		{ $limit: 10 },
		{
			$lookup: {
				from: "tickets",
				localField: "tickets",
				foreignField: "_id",
				pipeline: [
					{
						$addFields: { id: "$_id" },
					},
					{ $project: { _id: 0 } },
				],
				as: "tickets",
			},
		},
		{
			$facet: {
				meta: [{ $count: "total" }, { $addFields: { page: 0 } }],
				data: [
					{
						$addFields: { id: "$_id" },
					},
					{ $project: { _id: 0 } },
				],
			},
		},
	]);

	res.send({ meta, data });
});

export { router as indexOrderRouter };
