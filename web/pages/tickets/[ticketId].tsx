import useAxios from "../../api/useAxios";
import { FormCard } from "../../components/FormCard";
import { ErrorCmp } from "../../components/Error";
import useRequest from "../../hooks/use-request";
import { Order } from "../../interface/Order";
import { Ticket } from "../../interface/Ticket";
import { NextPageContext } from "next";
import Router from "next/router";

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
		<FormCard>
			<div className="flex flex-col items-start gap-2">
				<h2 className="text-2xl font-semibold text-center">{ticket.title}</h2>
				<h4>Price: ${Number(ticket.price).toFixed(2)}</h4>
				{errors && <ErrorCmp errors={errors} />}
				<button
					type="submit"
					className="btn btn-primary"
					onClick={() => doRequest()}
				>
					Purchase
				</button>
			</div>
		</FormCard>
	);
};

TicketShow.getInitialProps = async (context: NextPageContext) => {
	const client = useAxios(context);
	const { ticketId } = context.query;

	const { data } = await client.get(`/api/tickets/${ticketId}`);
	return { ticket: data };
};

export default TicketShow;
