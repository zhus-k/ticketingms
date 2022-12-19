import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/helpers";

const createNewTicket = () => {
	return request(app)
		.post("/api/tickets")
		.set("Cookie", signin())
		.send({ title: "test1", price: 10 })
		.expect(201);
};

it("can fetch a list of tickets", async () => {
	await createNewTicket();
	await createNewTicket();
	await createNewTicket();

	const response = await request(app).get("/api/tickets").send().expect(200);

	expect(response.body.length).toEqual(3);
});
