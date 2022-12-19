import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });

jest.mock("../nats-wrapper.ts");

let mongo: MongoMemoryServer;
beforeAll(async () => {
	process.env.JWT_SECRET = "asdf";

	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	// REASON: DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7
	mongoose.set("strictQuery", false);

	await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	if (mongo) {
		await mongo.stop();
	}
	await mongoose.connection.close();
});
