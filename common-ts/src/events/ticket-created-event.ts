import { Event } from "./base-event";
import { Subjects } from "./subjects";

export interface TicketCreatedEvent extends Event {
	subject: Subjects.TicketCreated;
	data: {
		id: string;
		version: number;
		title: string;
		price: number;
		userId: string;
	};
}
