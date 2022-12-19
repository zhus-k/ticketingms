import { PaymentCreatedEvent, Publisher, Subjects } from "@zjs-tix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
