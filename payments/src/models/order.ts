import { OrderStatus } from "@zjs-tix/ticketingms-common-ts";
import mongoose from "mongoose";

interface OrderAttrs {
	id: string;
	version: number;
	userId: string;
	price: number;
	status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
	version: number;
	userId: string;
	price: number;
	status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build: (attrs: OrderAttrs) => OrderDoc;
}

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
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
orderSchema.set("versionKey", "version");

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order({
		_id: attrs.id,
		version: attrs.version,
		price: attrs.price,
		userId: attrs.userId,
		status: attrs.status,
	});
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
