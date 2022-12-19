import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/helpers";

import mongoose from "mongoose";

it("returns a 404 if a ticket is not found", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns a ticket if a ticket is found", async () => {
	const title = "title";
	const price = 1;

	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({ title, price })
		.expect(201);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200);

	expect(ticketResponse.body.title).toEqual(title);
	expect(ticketResponse.body.price).toEqual(price);
});
