import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

import { Ticket } from "../../models/ticket";
import { signin } from "../../test/helpers";

it("fetches the order", async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "test",
		price: 200,
	});
	await ticket.save();

	const user = signin();

	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id })
		.expect(201);

	const { body: fetchOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(200);

	expect(fetchOrder.id).toEqual(order.id);
});

it("returns error if user access another user order", async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "test",
		price: 200,
	});
	await ticket.save();

	const user1 = signin();
	const user2 = signin();

	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user1)
		.send({ ticketId: ticket.id })
		.expect(201);

	await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", user2)
		.send()
		.expect(401);
});
