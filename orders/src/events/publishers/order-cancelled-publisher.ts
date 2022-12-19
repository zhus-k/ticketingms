import { Publisher, Subjects, OrderCancelledEvent } from "@zjs-tix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
