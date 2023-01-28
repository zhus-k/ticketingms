import {
	OrderCreatedEvent,
	Publisher,
	Subjects,
} from "@zjs-tix/ticketingms-common-ts";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
}
