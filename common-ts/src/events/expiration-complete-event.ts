import { Event } from "./base-event";
import { Subjects } from "./subjects";

export interface ExpirationCompleteEvent extends Event {
	subject: Subjects.OrderExpired;
	data: {
		orderId: string;
	};
}
