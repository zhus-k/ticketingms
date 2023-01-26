import { app } from "../../app";
import request from "supertest";
import { generateEvent, signin } from "../../test/helpers";
import { Types } from "mongoose";
import { IEvent } from "../../models/event";

it("returns 404 if event not found", async () => {
	const randId = new Types.ObjectId().toHexString();
	return request(app).get(`/api/events/${randId}`).send().expect(404);
});

it("is accessible if authenticated", async () => {
	await request(app).post("/api/events").send({}).expect(401);
});

it("is inaccessible if not authenticated", async () => {
	const response = await request(app)
		.post("/api/events")
		.set("Cookie", signin())
		.send({});

	expect(response.statusCode).not.toEqual(401);
});

it("returns errors if valid request body", async () => {
	const randEvent = generateEvent();

	let signOn = signin();

	const postRes = await request(app)
		.post("/api/events")
		.set("Cookie", signOn)
		.send(randEvent)
		.expect(201);

	postRes.body.description = undefined;

	return request(app)
		.put(`/api/events/${postRes.body.id}`)
		.set("Cookie", signOn)
		.send(postRes.body)
		.expect(400);
});

it("returns errors if valid request body", async () => {
	const randEvent = generateEvent();

	let signOn = signin();

	const postRes = await request(app)
		.post("/api/events")
		.set("Cookie", signOn)
		.send(randEvent)
		.expect(201);

	const randEvent2 = generateEvent();
	postRes.body.description = randEvent2.description;

	return request(app)
		.put(`/api/events/${postRes.body.id}`)
		.set("Cookie", signOn)
		.send(randEvent)
		.expect(200);
});
