import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * Creates a signin then a signup and then returns a cookie
 * @returns {Promise<string[]>}
 */
export const signin = (): string[] => {
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: "user@example.com",
	};

	const token = jwt.sign(payload, process.env.JWT_SECRET!);
	const session = { jwt: token };

	const sessionJSON = JSON.stringify(session);

	const base64 = Buffer.from(sessionJSON).toString("base64");

	return [`session=${base64}`];
};
