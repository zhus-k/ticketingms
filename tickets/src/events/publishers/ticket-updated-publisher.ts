import { Publisher, Subjects, TicketUpdatedEvent } from "@zjs-tix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
