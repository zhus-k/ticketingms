import { OrderCancelledEvent } from "@zjs-tix/ticketingms-common-ts";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const orderId = new mongoose.Types.ObjectId().toHexString();
	const ticket = Ticket.build({
		title: "test",
		price: 110,
		userId: "123",
	});

	ticket.set({ orderId });

	await ticket.save();

	const data: OrderCancelledEvent["data"] = {
		version: 0,
		id: orderId,
		ticket: {
			id: ticket.id,
		},
	};

	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, message };
};

it("updates ticket when order is cancelled", async () => {
	const { listener, ticket, data, message } = await setup();

	await listener.onMessage(data, message);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).not.toBeDefined();
});

it("updates ticket when order is cancelled, and publishes the event", async () => {
	const { listener, ticket, data, message } = await setup();

	await listener.onMessage(data, message);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("updates ticket when order is cancelled, and publishes the event", async () => {
	const { listener, ticket, data, message } = await setup();

	await listener.onMessage(data, message);

	expect(message.ack).toHaveBeenCalled();
});
