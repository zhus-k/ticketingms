import { Event } from "../models/event";
import { eventValidator } from "./validator-schemas/event-validator";
import { requireAuth, validateRequest } from "@zjs-tix/ticketingms-common-ts";
import { Request, Response, Router } from "express";
import { checkSchema } from "express-validator";

const router = Router();

router.post(
	"/api/events",
	requireAuth,
	// TODO add check for admin middleware
	checkSchema(eventValidator),
	validateRequest,
	async (req: Request, res: Response) => {
		const {
			address,
			type,
			dates,
			description,
			features,
			hosts,
			languages,
			name,
			organizers,
			tags,
		} = req.body;

		const event = new Event({
			address,
			type,
			dates,
			description,
			features,
			hosts,
			languages,
			name,
			organizers,
			tags,
		});

		await event.save();
		res.status(201).send(event);
	},
);

export { router as createEventRouter };
