import { Ticket } from "./Ticket";

export enum OrderStatus {
	Created = "created",
	Cancelled = "cancelled",
	AwaitingPayment = "awaiting:payment",
	Complete = "complete",
}

export interface Order {
	id: string;
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: Ticket;
}
