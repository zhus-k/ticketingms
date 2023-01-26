import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { IEvent, EVENT_TYPE_OPTIONS } from "../models/event";

/**
 * Creates a signin then a signup and then returns a cookie
 * @returns {Promise<string[]>}
 */
export const signin = (): string[] => {
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: faker.internet.email(),
	};

	const token = jwt.sign(payload, process.env.JWT_SECRET!);
	const session = { jwt: token };

	const sessionJSON = JSON.stringify(session);

	const base64 = Buffer.from(sessionJSON).toString("base64");

	return [`session=${base64}`];
};

export const generateEvent = (): IEvent => {
	return {
		name: faker.lorem.sentence(2),
		description: faker.lorem.sentence(3),
		type: faker.helpers.arrayElement(EVENT_TYPE_OPTIONS),
		dates: {
			startsAt: faker.date.soon(1).toISOString(),
			endsAt: faker.date.soon(2).toISOString(),
		},
		address: {
			street1: faker.address.streetAddress(),
			street2: undefined,
			street3: undefined,
			country: faker.address.country(),
			province: faker.address.state(),
			city: faker.address.city(),
			postalCode: undefined,
		},
		languages: [],
	} satisfies Partial<IEvent>;
};
