import { Event } from "./base-event";
import { Subjects } from "./subjects";

export interface EventUpdatedEvent extends Event {
	subject: Subjects.EventUpdated;
	data: {
		id: string;
		version: number;
		name: string;
		description: number;
		location: unknown;
	};
}
