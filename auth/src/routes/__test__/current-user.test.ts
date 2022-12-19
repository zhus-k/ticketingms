import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/helpers";

it("responds with details about current user", async () => {
	const cookie = await signin();

	const response = await request(app)
		.get("/api/users/currentuser")
		.set("Cookie", cookie)
		.send()
		.expect(200);

	expect(response.body.currentUser.email).toEqual("user@example.com");
});

it("responses with null if not authenticated", async () => {
	const response = await request(app)
		.get("/api/users/currentuser")
		.send()
		.expect(200);

	expect(response.body.currentUser).toBeNull();
});
