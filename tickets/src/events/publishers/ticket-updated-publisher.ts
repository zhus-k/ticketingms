import { Publisher, Subjects, TicketUpdatedEvent } from "@zjs-tix/ticketingms-common-ts";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
