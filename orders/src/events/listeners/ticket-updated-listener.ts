import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import {
	Listener,
	Subjects,
	TicketUpdatedEvent,
} from "@zjs-tix/ticketingms-common-ts";
import { Message } from "node-nats-streaming";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;
	async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
		const { title, price } = data;

		const ticket = await Ticket.findByReceivedEvent(data);

		if (!ticket) {
			throw new Error("Ticket not found");
		}

		ticket.set({ title, price });

		// Mongo will not update version if any data is unchanged, so we mark as modified
		ticket.markModified("title");

		await ticket.save();

		msg.ack();
	}
}
