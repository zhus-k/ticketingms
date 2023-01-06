import { ExpirationCompleteEvent, Publisher, Subjects } from "common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}
