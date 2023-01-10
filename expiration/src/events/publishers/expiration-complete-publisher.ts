import { ExpirationCompleteEvent, Publisher, Subjects } from "@zjs-tix/ticketingms-common-ts";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}
