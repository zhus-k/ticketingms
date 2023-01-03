import { Publisher, Subjects, TicketCreatedEvent } from "common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
