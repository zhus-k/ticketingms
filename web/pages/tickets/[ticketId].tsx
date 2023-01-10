import { AxiosInstance } from "axios";
import { NextPageContext } from "next";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { Order } from "../../interface/Order";
import { Ticket } from "../../interface/Ticket";

interface OwnProps {
	ticket: Ticket;
}

const TicketShow = ({ ticket }: OwnProps) => {
	const { doRequest, errors } = useRequest({
		url: "/api/orders",
		method: "post",
		body: { ticketId: ticket.id },
		onSuccess: (order: Order) =>
			Router.push("/orders/orderId", `/orders/${order.id}`),
	});

	return (
		<div>
			<h1>{ticket.title}</h1>
			<h4>Price: {ticket.price}</h4>
			{errors}
			<button
				type="submit"
				className="btn btn-primary"
				onClick={() => doRequest()}
			>
				Purchase
			</button>
		</div>
	);
};

TicketShow.getInitialProps = async (
	context: NextPageContext,
	client: AxiosInstance,
) => {
	const { ticketId } = context.query;

	const { data } = await client.get(`/api/tickets/${ticketId}`);
	return { ticket: data };
};

export default TicketShow;
