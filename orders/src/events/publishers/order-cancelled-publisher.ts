import { Publisher, Subjects, OrderCancelledEvent } from "common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
