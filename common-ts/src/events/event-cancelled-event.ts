import { Event } from "./base-event";
import { Subjects } from "./subjects";

export interface EventCancelledEvent extends Event {
	subject: Subjects.EventCancelled;
	data: {
		id: string;
		version: number;
		name: string;
	};
}
