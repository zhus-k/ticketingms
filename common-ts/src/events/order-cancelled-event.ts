import { Event } from "./base-event";
import { Subjects } from "./subjects";

export interface OrderCancelledEvent extends Event {
	subject: Subjects.OrderCancelled;
	data: {
		version: number;
		id: string;
		tickets: {
			id: string;
		}[];
	};
}
