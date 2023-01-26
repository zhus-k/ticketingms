import { app } from "../../app";
import request from "supertest";
import { generateEvent, signin } from "../../test/helpers";

it("has a route handler listening to /api/events for post requests", async () => {
	const response = await request(app).post("/api/events").send({});

	expect(response.statusCode).not.toEqual(404);
});

it("accessible only if authenticated", async () => {
	await request(app).post("/api/events").send({}).expect(401);
});

it("401 if not authenticated", async () => {
	const response = await request(app)
		.post("/api/events")
		.set("Cookie", signin())
		.send({});

	expect(response.statusCode).not.toEqual(401);
});

it("error if wrong invalid inputs", async () => {
	return request(app)
		.post("/api/events")
		.set("Cookie", signin())
		.send({})
		.expect(400);
});

it("success on valid inputs", async () => {
	const response = await request(app)
		.post("/api/events")
		.set("Cookie", signin())
		.send(generateEvent());

	expect(response.statusCode).not.toEqual(401);
	expect(response.statusCode).toEqual(201);
});
