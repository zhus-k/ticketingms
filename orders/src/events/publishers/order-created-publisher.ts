import { Publisher, OrderCreatedEvent, Subjects } from "@zjs-tix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
}
