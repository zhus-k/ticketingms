import { Event } from "./base-event";
import { Subjects } from "./subjects";

export interface TicketUpdatedEvent extends Event {
	subject: Subjects.TicketUpdated;
	data: {
		id: string;
		version: number;
		title: string;
		price: number;
		userId: string;
		orderId?: string;
		eventId?: string;
	};
}
