import Stripe from "stripe";

export const stripe = new Stripe(
	process.env.NODE_ENV === "test"
		? process.env.STRIPE_SECRET_DEV!
		: process.env.STRIPE_SECRET!,
	{
		apiVersion: "2022-11-15",
	},
);
