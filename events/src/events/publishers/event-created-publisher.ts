import {
	EventCreatedEvent,
	Publisher,
	Subjects,
} from "@zjs-tix/ticketingms-common-ts";

export class EventCreatedPublisher extends Publisher<EventCreatedEvent> {
	readonly subject = Subjects.EventCreated;
}
