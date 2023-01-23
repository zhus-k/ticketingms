import { Stan } from "node-nats-streaming";
import { Event } from "./base-event";

export abstract class Publisher<T extends Event, D = T["data"]> {
	abstract subject: T["subject"];
	protected client: Stan;

	constructor(client: Stan) {
		this.client = client;
	}

	publish(data: D) {
		return new Promise<void>((resolve, reject) => {
			this.client.publish(this.subject, JSON.stringify(data), (err) => {
				if (err) {
					return reject(err);
				}
				console.log(`Event published to subject: ${this.subject}`);
				resolve();
			});
		});
	}
}
