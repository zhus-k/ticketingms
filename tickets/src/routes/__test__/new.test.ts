import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/helpers";

import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
	const response = await request(app).post("/api/tickets").send({});

	expect(response.statusCode).not.toEqual(404);
});

it("can only be accessed if user is authenticated", async () => {
	await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns not 401 if user is authenticated", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({});

	expect(response.statusCode).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
	await request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({ title: "", price: 10 })
		.expect(400);

	await request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({ price: 10 })
		.expect(400);
});

it("returns an errors if invalid price is provided", async () => {
	await request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({ title: "test", price: -10 })
		.expect(400);

	await request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({ title: "test", price: 0 })
		.expect(400);

	await request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({ title: "test" })
		.expect(400);
});

it("creates a ticket with valid inputs", async () => {
	let tickets = await Ticket.find({});
	expect(tickets.length).toEqual(0);

	await request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({ title: "test", price: 10 })
		.expect(201);

	tickets = await Ticket.find({});
	expect(tickets.length).toEqual(1);
	expect(tickets[0].title).toEqual("test");
	expect(tickets[0].price).toEqual(10);
});

it("it publishes an event", async () => {
	await request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({ title: "test", price: 10 })
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
