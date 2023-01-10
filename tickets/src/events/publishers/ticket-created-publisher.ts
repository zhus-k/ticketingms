import { Publisher, Subjects, TicketCreatedEvent } from "@zjs-tix/ticketingms-common-ts";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
