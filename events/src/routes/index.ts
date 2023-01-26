import { Event } from "../models/event";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/api/events", async (req: Request, res: Response) => {
	const events = await Event.find().skip(0).limit(10).lean();

	res.send(events);
});

export { router as indexEventRouter };
