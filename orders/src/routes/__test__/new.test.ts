import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { signin } from "../../test/helpers";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if ticket does not exist", async () => {
	const ticketId = new mongoose.Types.ObjectId();
	await request(app)
		.post("/api/orders")
		.set("Cookie", signin())
		.send({
			ticketId,
		})
		.expect(404);
});

it("returns an error if ticket already reserved", async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "test",
		price: 10,
	});
	await ticket.save();

	const order = Order.build({
		ticket,
		userId: "someId",
		status: OrderStatus.Created,
		expiresAt: new Date(),
	});
	await order.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", signin())
		.send({
			ticketId: ticket.id,
		})
		.expect(400);
});

it("reserves a ticket", async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "test",
		price: 10,
	});
	await ticket.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", signin())
		.send({
			ticketId: ticket.id,
		})
		.expect(201);
});

it("emits and order:created event", async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "test",
		price: 10,
	});
	await ticket.save();

	await request(app)
		.post("/api/orders")
		.set("Cookie", signin())
		.send({
			ticketId: ticket.id,
		})
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
