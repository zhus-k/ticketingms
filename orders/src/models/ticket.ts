import { Order, OrderStatus } from "./order";
import { HydratedDocument, Model, Schema, model } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

export interface ITicket {
	id?: string;
	title: string;
	price: number;
	version?: number;
}

interface ITicketMethods {
	isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<ITicket, {}, ITicketMethods> {
	version: number;
	findByReceivedEvent(event: {
		id: string;
		version: number;
	}): Promise<HydratedDocument<ITicket, ITicketMethods>>;
}

export const TicketSchema = new Schema(
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
		optimisticConcurrency: true,
		versionKey: "version",
		toJSON: {
			transform(doc, ret, options) {
				ret.id = ret._id;
				ret._id = undefined;
			},
		},
	},
);

TicketSchema.static(
	"findByReceivedEvent",
	async function (event: {
		id: string;
		version: number;
	}) {
		return await this.findOne({
			_id: event.id,
			version: event.version - 1,
		});
	},
);

TicketSchema.method("isReserved", async function () {
	const existingOrder = await Order.findOne({
		tickets: [this],
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
			],
		},
	});

	return !!existingOrder;
});

TicketSchema.plugin(mongooseLeanVirtuals);

const TicketModel = model<ITicket, TicketModel>("Ticket", TicketSchema);

export class Ticket extends TicketModel {}
