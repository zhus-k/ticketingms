import {
	EventUpdatedEvent,
	Publisher,
	Subjects,
} from "@zjs-tix/ticketingms-common-ts";

export class EventUpdatedPublisher extends Publisher<EventUpdatedEvent> {
	readonly subject = Subjects.EventUpdated;
}
