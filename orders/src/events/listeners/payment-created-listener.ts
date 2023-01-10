import {
	Listener,
	NotFoundError,
	OrderStatus,
	PaymentCreatedEvent,
	Subjects,
} from "@zjs-tix/ticketingms-common-ts";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
	queueGroupName = queueGroupName;

	async onMessage(event: PaymentCreatedEvent["data"], msg: Message) {
		const order = await Order.findById(event.orderId);
		if (!order) {
			throw new NotFoundError();
		}

		order.set({ status: OrderStatus.Complete });
		await order.save();

		msg.ack();
	}
}
