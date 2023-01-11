export enum OrderStatus {
	// Order is created, the ticket was not reserved
	Created = "created",
	// Ticket has already been reserved or user called the order, order expires before payment
	Cancelled = "cancelled",
	// Order reserved the ticket
	AwaitingPayment = "awaiting:payment",
	// Order is paid and placed
	Complete = "complete",
}
