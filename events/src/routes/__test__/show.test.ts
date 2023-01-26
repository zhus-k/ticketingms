import { app } from "../../app";
import request from "supertest";
import { generateEvent, signin } from "../../test/helpers";
import { Types } from "mongoose";

it("returns 404 if event not found", async () => {
	const randId = new Types.ObjectId().toHexString();
	return request(app).get(`/api/events/${randId}`).send().expect(404);
});

it("returns event if found", async () => {
	const randEvent = generateEvent();
	const postRes = await request(app)
		.post("/api/events")
		.set("Cookie", signin())
		.send(randEvent)
		.expect(201);

	const getRes = await request(app)
		.get(`/api/events/${postRes.body.id}`)
		.send()
		.expect(200);

	expect(getRes.body.name).toEqual(randEvent.name);
	expect(getRes.body.description).toEqual(randEvent.description);
	expect(getRes.body.address).toEqual(randEvent.address);
});
