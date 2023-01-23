import { Event } from "./base-event";
import { Subjects } from "./subjects";

export interface EventCreatedEvent extends Event {
	subject: Subjects.EventCreated;
	data: {
		id: string;
		version: number;
		name: string;
		description: number;
		location: unknown;
	};
}
