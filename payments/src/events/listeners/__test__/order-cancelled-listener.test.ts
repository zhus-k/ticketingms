import { OrderCancelledEvent, OrderStatus } from "common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		userId: "123",
		price: 123,
		status: OrderStatus.Created,
	});

	await order.save();

	const data: OrderCancelledEvent["data"] = {
		version: order.version + 1,
		id: order.id,
		ticket: {
			id: "123",
		},
	};

	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};

	return { order, listener, data, message };
};

it("should update order as cancelled", async () => {
	const { order, listener, data, message } = await setup();

	await listener.onMessage(data, message);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
	const { order, listener, data, message } = await setup();

	await listener.onMessage(data, message);

	expect(message.ack).toHaveBeenCalled();
});
