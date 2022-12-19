import { Publisher, Subjects, TicketCreatedEvent } from "@zjs-tix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
