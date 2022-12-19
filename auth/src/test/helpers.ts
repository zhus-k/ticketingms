import { app } from "../app";
import request from "supertest";

/**
 * Creates a signin then a signup and then returns a cookie
 * @returns {Promise<string[]>}
 */
export const signin = async (): Promise<string[]> => {
	const email = "user@example.com";
	const password = "password";

	const response = await request(app)
		.post("/api/users/signup")
		.send({ email, password })
		.expect(201);

	const cookie = response.get("Set-Cookie");

	return cookie;
};
