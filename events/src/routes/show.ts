import { Event } from "../models/event";
import { NotFoundError } from "@zjs-tix/ticketingms-common-ts";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/api/events/:id", async (req: Request, res: Response) => {
	const event = await Event.findById(req.params.id).lean();
	if (!event) {
		throw new NotFoundError();
	}

	res.send(event);
});

export { router as showEventRouter };
