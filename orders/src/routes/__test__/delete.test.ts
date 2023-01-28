import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { signin } from "../../test/helpers";
import request from "supertest";

it("marks an order as cancelled", async () => {
	const ticket = new Ticket({
		title: "ticket",
		price: 100,
	});
	await ticket.save();

	const user = signin();
	const {
		body: { data: order },
	} = await request(app)
		.post("/api/orders/")
		.set("Cookie", user)
		.send({ tickets: [ticket.id] })
		.expect(201);

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(204);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
	const ticket = new Ticket({
		title: "ticket",
		price: 100,
	});
	await ticket.save();

	const user = signin();
	const {
		body: { data: order },
	} = await request(app)
		.post("/api/orders/")
		.set("Cookie", user)
		.send({ tickets: [ticket.id] })
		.expect(201);

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(204);

	// 1 Time for creating order, 1 Time for cancelling order
	expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
