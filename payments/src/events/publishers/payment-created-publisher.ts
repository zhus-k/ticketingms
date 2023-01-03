import { PaymentCreatedEvent, Publisher, Subjects } from "common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
