import { OrderCreatedEvent, OrderStatus } from "common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);

	const ticket = Ticket.build({
		title: "test",
		price: 110,
		userId: "123",
	});
	await ticket.save();

	const data: OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: "abc",
		expiresAt: "any",
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
	};

	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, message };
};

it("sets userId of ticket", async () => {
	const { listener, ticket, data, message } = await setup();

	await listener.onMessage(data, message);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
	const { listener, ticket, data, message } = await setup();

	await listener.onMessage(data, message);

	expect(message.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
	const { listener, ticket, data, message } = await setup();

	await listener.onMessage(data, message);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const ticketUpdatedData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
	);

	expect(data.id).toEqual(ticketUpdatedData.orderId);
});
