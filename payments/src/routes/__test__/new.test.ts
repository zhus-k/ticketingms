import { OrderStatus } from "@zjs-tix/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payments";
import { natsWrapper } from "../../nats-wrapper";
import { stripe } from "../../stripe";
import { signin } from "../../test/helpers";

const STRIPE_SECRET_DEV = process.env.STRIPE_SECRET_DEV;

if (!STRIPE_SECRET_DEV) {
	throw new Error("Please set the environment variable STRIPE_SECRET_DEV");
}

it("returns 404 if order is not found", async () => {
	await request(app)
		.post("/api/payments")
		.set("Cookie", signin())
		.send({
			token: "123",
			orderId: new mongoose.Types.ObjectId().toHexString(),
		})
		.expect(404);
});

it("returns 401 if order does not belong to user", async () => {
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		userId: new mongoose.Types.ObjectId().toHexString(),
		price: 120,
		status: OrderStatus.Created,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", signin())
		.send({
			token: "123",
			orderId: order.id,
		})
		.expect(401);
});

it("returns 400 if order was found cancelled", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		userId,
		price: 120,
		status: OrderStatus.Cancelled,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", signin(userId))
		.send({ token: "123", orderId: order.id })
		.expect(400);
});

it("return a 201 on valid charge", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();
	const price = Math.floor(Math.random() * 1000);
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		userId,
		price,
		status: OrderStatus.Created,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", signin(userId))
		.send({ token: "tok_visa", orderId: order.id })
		.expect(201);

	const stripeCharges = await stripe.charges.list({ limit: 50 });

	const stripeCharge = stripeCharges.data.find(
		(charge) => charge.amount === price * 100 && charge.currency === "usd",
	);

	expect(stripeCharge).toBeDefined();
	expect(stripeCharge!.currency).toEqual("usd");

	const payment = await Payment.findOne({
		orderId: order.id,
		stripeId: stripeCharge!.id,
	});

	expect(payment).not.toBeNull();
});

it("publishes the message", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();
	const price = Math.floor(Math.random() * 1000);
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		userId,
		price,
		status: OrderStatus.Created,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", signin(userId))
		.send({ token: "tok_visa", orderId: order.id })
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
