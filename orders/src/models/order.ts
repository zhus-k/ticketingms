import { Ticket } from "./ticket";
import { OrderStatus } from "@zjs-tix/ticketingms-common-ts";
import { Schema, model } from "mongoose";
import { mongooseLeanVirtuals } from "mongoose-lean-virtuals";

export { OrderStatus };

export interface IOrder {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	tickets: Ticket[];
}

const OrderSchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
			default: OrderStatus.Created,
		},
		expiresAt: {
			type: Schema.Types.Date,
			required: false,
		},
		tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
	},
	{
		optimisticConcurrency: true,
		versionKey: "version",
		timestamps: true,
		toJSON: {
			transform(doc, ret, options) {
				ret.id = ret._id;
				ret._id = undefined;
			},
		},
	},
);

OrderSchema.plugin(mongooseLeanVirtuals);

const OrderModel = model<IOrder>("Order", OrderSchema);

export class Order extends OrderModel {}
