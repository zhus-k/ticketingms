import { ExpirationCompleteEvent } from "common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client);

	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "test",
		price: 100,
	});
	await ticket.save();

	const order = Order.build({
		userId: "123",
		status: OrderStatus.Created,
		expiresAt: new Date(),
		ticket: ticket,
	});
	await order.save();

	const data: ExpirationCompleteEvent["data"] = {
		orderId: order.id,
	};

	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};

	return { ticket, order, listener, data, message };
};

it("should update order status to cancelled", async () => {
	const { ticket, order, listener, data, message } = await setup();

	await listener.onMessage(data, message);

	const orderUpdatedData = await Order.findById(order.id);

	expect(orderUpdatedData!.status).toEqual(OrderStatus.Cancelled);
});

it("should emit an order:cancelled event", async () => {
	const { ticket, order, listener, data, message } = await setup();

	await listener.onMessage(data, message);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const eventData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
	);

	expect(eventData.id).toEqual(order.id);
});
it("should ack the message", async () => {
	const { ticket, order, listener, data, message } = await setup();

	await listener.onMessage(data, message);

	expect(message.ack).toHaveBeenCalled();
});
