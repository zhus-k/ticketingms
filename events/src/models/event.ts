import { Model, Schema, model } from "mongoose";

export const EVENT_TYPE_OPTIONS = [
	"concert",
	"sport",
	"theatre",
	"other",
] as const;
export type EventType = typeof EVENT_TYPE_OPTIONS[number];

export interface IEvent {
	name: string;
	description: string;
	type: EventType;
	hosts?: string[];
	features?: string[];
	organizers?: string[];
	tags?: string[];
	dates: {
		startsAt: string;
		endsAt: string;
	};
	address: {
		street1: string;
		street2?: string;
		street3?: string;
		country: string;
		province: string;
		city: string;
		postalCode?: string;
		LatLong?: string;
	};
	languages?: string[];
	readonly version?: number;
}

const eventSchema = new Schema<IEvent, Model<IEvent>>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		hosts: [
			{
				type: String,
				required: false,
			},
		],
		features: [
			{
				type: String,
				required: false,
			},
		],
		organizers: [
			{
				type: String,
				required: false,
			},
		],
		tags: [
			{
				type: String,
				required: false,
			},
		],
		dates: {
			startsAt: {
				type: String,
				required: true,
			},
			endsAt: {
				type: String,
				required: true,
			},
		},
		address: {
			street1: {
				type: String,
				required: true,
			},
			street2: {
				type: String,
				required: false,
			},
			street3: {
				type: String,
				required: false,
			},
			country: {
				type: String,
				required: true,
			},
			province: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			postalCode: {
				type: String,
				required: false,
			},
			LatLong: {
				type: String,
				required: false,
			},
		},
		languages: [
			{
				type: String,
				required: false,
			},
		],
	},
	{
		toJSON: {
			transform(doc, ret, options) {
				ret.id = ret._id;
				ret._id = undefined;
			},
		},
		optimisticConcurrency: true,
	},
);

eventSchema.set("versionKey", "version");

class Event extends model<IEvent>("Event", eventSchema) {}

export { Event };
