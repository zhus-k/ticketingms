import {
	Listener,
	Subjects,
	TicketCreatedEvent,
} from "@zjs-tix/ticketingms-common-ts";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
	queueGroupName = queueGroupName;
	async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
		// const ticket = Ticket
		//
	}
}
