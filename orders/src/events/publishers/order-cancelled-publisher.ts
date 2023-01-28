import {
	OrderCancelledEvent,
	Publisher,
	Subjects,
} from "@zjs-tix/ticketingms-common-ts";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
