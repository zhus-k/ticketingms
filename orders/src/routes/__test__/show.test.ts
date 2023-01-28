import { app } from "../../app";
import request from "supertest";

import { Ticket } from "../../models/ticket";
import { signin } from "../../test/helpers";

it("fetches the order", async () => {
	const ticket = new Ticket({
		title: "test",
		price: 200,
	});
	await ticket.save();

	const user = signin();

	const {
		body: { data: order },
	} = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ tickets: [ticket.id] })
		.expect(201);

	const {
		body: { data: fetchOrder },
	} = await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(200);

	expect(fetchOrder.id).toEqual(order.id);
});

it("returns error if user access another user order", async () => {
	const ticket = new Ticket({
		title: "test",
		price: 200,
	});
	await ticket.save();
	const user1 = signin();
	const user2 = signin();
	const {
		body: { data: order },
	} = await request(app)
		.post("/api/orders")
		.set("Cookie", user1)
		.send({ tickets: [ticket.id] })
		.expect(201);
	await request(app)
		.get(`/api/orders/${order.id}`)
		.set("Cookie", user2)
		.send()
		.expect(401);
});
