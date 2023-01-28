import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { signin } from "../../test/helpers";
import { faker } from "@faker-js/faker";
import request from "supertest";

const buildTicket = async () => {
	const ticket = new Ticket({
		title: faker.random.words(3),
		price: parseFloat(faker.commerce.price(0, 200)),
	});

	await ticket.save();

	return ticket;
};

it("fetches orders for one user", async () => {
	const ticket1 = await buildTicket();
	const ticket2 = await buildTicket();
	const ticket3 = await buildTicket();

	const user1 = signin();
	const user2 = signin();

	await request(app)
		.post("/api/orders")
		.set("Cookie", user1)
		.send({ tickets: [ticket1.id] })
		.expect(201);

	const {
		body: { data: order1 },
	} = await request(app)
		.post("/api/orders")
		.set("Cookie", user2)
		.send({ tickets: [ticket2.id] })
		.expect(201);

	const {
		body: { data: order2 },
	} = await request(app)
		.post("/api/orders")
		.set("Cookie", user2)
		.send({ tickets: [ticket3.id] })
		.expect(201);

	const {
		body: { data },
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	}: { body: { data: any[] } } = await request(app)
		.get("/api/orders")
		.set("Cookie", user2)
		.send()
		.expect(200);

	// Sorted ascending
	data.sort((a, b) => {
		return a.createdAt === b.createdAt ? 0 : a.createdAt < b.createdAt ? -1 : 1;
	});

	expect(data.length).toEqual(2);
	expect(data[0].id).toEqual(order1.id);
	expect(data[1].id).toEqual(order2.id);
	expect(data[0].tickets[0].id).toEqual(ticket2.id);
	expect(data[1].tickets[0].id).toEqual(ticket3.id);
});
