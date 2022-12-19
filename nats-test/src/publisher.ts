import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
});

stan.on("connect", async () => {
	console.log("PUB connected");

	const publisher = new TicketCreatedPublisher(stan);
	await publisher
		.publish({
			id: "123",
			title: "title",
			price: 33,
		})
		.catch((err) => {
			console.log(err);
		});

	// const data = JSON.stringify({
	// 	id: "123",
	// 	title: "title",
	// 	price: 33,
	// });
	//
	// stan.publish("ticket:created", data, () => {
	// 	console.log("[published] ticket:created");
	// });
});
