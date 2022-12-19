import { Subjects, TicketCreatedEvent } from "@zjs-tix/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
	// create listener instance
	const listener = new TicketCreatedListener(natsWrapper.client);
	// fake data event
	const data: TicketCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		title: "test",
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};

	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};

	// fake message
	return { listener, data, message };
};

it("creates and saves a ticket", async () => {
	const { listener, data, message } = await setup();
	// on message with fake data and message
	await listener.onMessage(data, message);
	// assert ticket was created
	const ticket = await Ticket.findById(data.id);
	expect(ticket).toBeDefined();
	expect(ticket!.title).toEqual(data.title);
	expect(ticket!.price).toEqual(data.price);
});

it("it acks a message", async () => {
	const { listener, data, message } = await setup();
	// on message with fake data and message
	await listener.onMessage(data, message);
	// assert message was acked
	expect(message.ack).toHaveBeenCalled();
});
