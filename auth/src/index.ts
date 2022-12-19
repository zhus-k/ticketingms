import "express-async-errors";
import mongoose from "mongoose";

import { app } from "./app";

// REASON: DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7
mongoose.set("strictQuery", false);

const start = async () => {
	console.log("starting auth");
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET must be defined");
	}
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}

	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("DB conn established");
	} catch (err) {
		console.log(err);
	}

	app.listen(3000, () => {
		console.log("Listening on port 3000!!!!!");
	});
};

start();
