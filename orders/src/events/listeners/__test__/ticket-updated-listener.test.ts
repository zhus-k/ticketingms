import { TicketUpdatedEvent } from "@zjs-tix/ticketingms-common-ts";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
	const listener = new TicketUpdatedListener(natsWrapper.client);

	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "test",
		price: 12,
	});
	await ticket.save();

	const data: TicketUpdatedEvent["data"] = {
		id: ticket.id,
		version: ticket.version + 1,
		title: "test2",
		price: 43,
		userId: "123",
	};

	// @ts-ignore
	const message: Message = {
		ack: jest.fn(),
	};

	return { ticket, listener, data, message };
};

it("finds, updates, and saves a ticket", async () => {
	const { ticket, listener, data, message } = await setup();

	await listener.onMessage(data, message);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
	expect(updatedTicket!.version).toEqual(data.version);

	const data2: TicketUpdatedEvent["data"] = {
		...data,
		version: ticket.version + 2,
	};

	await listener.onMessage(data2, message);

	const updatedTicket2 = await Ticket.findById(ticket.id);

	expect(updatedTicket2!.title).toEqual(data2.title);
	expect(updatedTicket2!.price).toEqual(data2.price);
	expect(updatedTicket2!.version).toEqual(data2.version);

	const data3: TicketUpdatedEvent["data"] = {
		...data,
		id: ticket.id,
		version: ticket.version + 3,
		title: "1234",
		price: 12,
		userId: "1234",
	};

	await listener.onMessage(data3, message);

	const updatedTicket3 = await Ticket.findById(ticket.id);

	expect(updatedTicket3!.title).toEqual(data3.title);
	expect(updatedTicket3!.price).toEqual(data3.price);
	expect(updatedTicket3!.version).toEqual(data3.version);
});

it("acks the message", async () => {
	const { ticket, listener, data, message } = await setup();

	await listener.onMessage(data, message);

	expect(message.ack).toHaveBeenCalled();
});

it("does not ack if event is out of order", async () => {
	const { ticket, listener, data, message } = await setup();

	data.version += 10;

	try {
		await listener.onMessage(data, message);
	} catch (error) {}

	expect(message.ack).not.toHaveBeenCalled();
});
