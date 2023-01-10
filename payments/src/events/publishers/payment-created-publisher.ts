import { PaymentCreatedEvent, Publisher, Subjects } from "@zjs-tix/ticketingms-common-ts";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
