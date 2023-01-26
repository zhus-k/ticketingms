import { Event } from "../models/event";
import { eventValidator } from "./validator-schemas/event-validator";
import {
	NotFoundError,
	requireAuth,
	validateRequest,
} from "@zjs-tix/ticketingms-common-ts";
import { Request, Response, Router } from "express";
import { checkSchema } from "express-validator";

const router = Router();

router.put(
	"/api/events/:id",
	requireAuth,
	// TODO add check for admin middleware
	checkSchema(eventValidator),
	validateRequest,
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const event = await Event.findById(id);

		if (!event) {
			throw new NotFoundError();
		}

		const {
			address,
			dates,
			description,
			features = [],
			hosts = [],
			languages = [],
			name,
			organizers = [],
			tags = [],
		} = req.body;

		event.set({
			address,
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

		res.send(event);
	},
);

export { router as updateEventRouter };
