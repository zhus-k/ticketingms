import { app } from "../../app";
import { generateEvent, signin } from "../../test/helpers";
import request from "supertest";

const createNewEvent = async () => {
	const event = generateEvent();

	return request(app)
		.post("/api/events")
		.set("Cookie", signin())
		.send(event)
		.expect(201);
};

it("can fetch a list of events", async () => {
	await createNewEvent();
	await createNewEvent();
	await createNewEvent();

	const response = await request(app).get("/api/events").send().expect(200);

	expect(response.body.length).toEqual(3);
});
