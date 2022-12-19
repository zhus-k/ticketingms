import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
	subject: Subjects;
	data: unknown;
}

export abstract class Listener<T extends Event> {
	abstract subject: T["subject"];
	abstract queueGroupName: string;
	abstract onMessage(data: T["data"], msg: Message): void;
	private client: Stan;
	protected ackWait = 5 * 1000;

	constructor(client: Stan) {
		this.client = client;
	}

	subscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setDeliverAllAvailable()
			.setManualAckMode(true)
			.setAckWait(this.ackWait)
			.setDurableName(this.queueGroupName);
	}

	listen() {
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions(),
		);

		subscription.on("message", (message: Message) => {
			console.log(`message received: ${this.subject} / ${this.queueGroupName}`);

			const parsedData = this.parseMessage(message);

			this.onMessage(parsedData, message);
		});
	}

	parseMessage(message: Message): string {
		const data = message.getData();
		return typeof message === "string"
			? JSON.stringify(data)
			: JSON.parse(data.toString("utf8"));
	}
}
