import request from "supertest";
import { app } from "../../app";

import mongoose from "mongoose";
import { signin } from "../../test/helpers";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if ticket of id does not exist", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set("Cookie", signin())
		.send({ title: "title", price: 12 })
		.expect(404);
});

it("returns a 401 if user it not authenticated", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({ title: "title", price: 12 })
		.expect(401);
});

it("returns a 401 if ticket does not own ticket", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({ title: "title", price: 12 })
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", signin())
		.send({ title: "new", price: 22 })
		.expect(401);
});

it("returns a 400 if update has invalid title or price", async () => {
	const cookie = signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({ title: "title", price: 12 })
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({ title: "", price: 110 })
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({ title: "asdf", price: -10 })
		.expect(400);
});

it("updates ticket with valid inputs", async () => {
	const cookie = signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({ title: "title", price: 12 })
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({ title: "newtitle", price: 110 })
		.expect(200);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200);

	expect(ticketResponse.body.title).toEqual("newtitle");
	expect(ticketResponse.body.price).toEqual(110);
});

it("it publishes an event", async () => {
	const cookie = signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({ title: "title", price: 12 })
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({ title: "newtitle", price: 110 })
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it("rejects updates if ticket is reserved", async () => {
	const cookie = signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({ title: "title", price: 12 })
		.expect(201);

	const ticket = await Ticket.findById(response.body.id);
	ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
	await ticket!.save();

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({ title: "newtitle", price: 110 })
		.expect(400);
});
