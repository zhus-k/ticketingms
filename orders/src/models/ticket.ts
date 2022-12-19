import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
	id: string;
	title: string;
	price: number;
}

export interface TicketDoc extends mongoose.Document {
	id: string;
	version: number;
	title: string;
	price: number;
	isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
	findByEvent(event: {
		id: string;
		version: number;
	}): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
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
ticketSchema.set("versionKey", "version");

ticketSchema.statics.findByEvent = async (event: {
	id: string;
	version: number;
}) => {
	return Ticket.findOne({ _id: event.id, version: event.version - 1 });
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket({
		_id: attrs.id,
		title: attrs.title,
		price: attrs.price,
	});
};

ticketSchema.methods.isReserved = async function () {
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
			],
		},
	});

	return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
