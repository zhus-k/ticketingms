import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { signin } from "../../test/helpers";
import mongoose from "mongoose";
import request from "supertest";

it("returns an error if ticket does not exist", async () => {
	const ticketId = new mongoose.Types.ObjectId();
	await request(app)
		.post("/api/orders")
		.set("Cookie", signin())
		.send({
			tickets: [ticketId],
		})
		.expect(404);
});

it("returns an error if ticket already reserved", async () => {
	const ticket = new Ticket({
		title: "test",
		price: 10,
	});
	await ticket.save();

	const order = new Order({
		tickets: [ticket],
		userId: "someId",
		status: OrderStatus.Created,
		expiresAt: new Date(new Date().getTime() + 1000 * 10),
	});

	await order.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", signin())
		.send({
			tickets: [ticket.id],
		})
		.expect(400);
});

it("reserves a ticket", async () => {
	const ticket = new Ticket({
		title: "test",
		price: 10,
	});
	await ticket.save();
	await request(app)
		.post("/api/orders")
		.set("Cookie", signin())
		.send({
			tickets: [ticket.id],
		})
		.expect(201);
});

it("emits and order:created event", async () => {
	const ticket = new Ticket({
		title: "test",
		price: 10,
	});
	await ticket.save();
	await request(app)
		.post("/api/orders")
		.set("Cookie", signin())
		.send({
			tickets: [ticket.id],
		})
		.expect(201);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
