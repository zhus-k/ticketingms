import { ExpirationCompleteEvent, Publisher, Subjects } from "@zjs-tix/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}
