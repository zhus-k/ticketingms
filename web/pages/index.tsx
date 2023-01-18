import Layout from "../components/Layout";
import { Ticket } from "../interface/Ticket";
import { selectTicketsList } from "../selectors/tickets";
import { fetchTickets } from "../slices/tickets";
import { wrapper } from "../store";
import { NextPageWithLayout } from "./_app";
import Link from "next/link";
import { useSelector } from "react-redux";

const LandingPage: NextPageWithLayout = () => {
	const tickets = useSelector(selectTicketsList);

	const ticketList = tickets?.map(
		(ticket: Ticket): JSX.Element => (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>${Number(ticket.price).toFixed(2)}</td>
				<td>
					<Link href="/tickets/ticketId" as={`/tickets/${ticket.id}`}>
						View
					</Link>
				</td>
			</tr>
		),
	);

	return (
		<div className="flex pt-4 justify-center">
			<div className="p-4 rounded shadow-md text-center w-full md:max-w-md">
				<h1 className="text-lg font-bold">Tickets</h1>
				<table className="table w-full md:max-w-screen-sm md:rounded border-slate-100 p-2 pb-4 border-2 border-separate alternate">
					<thead>
						<tr>
							<th>Item</th>
							<th>Price</th>
							<th>Link</th>
						</tr>
					</thead>
					<tbody>{ticketList}</tbody>
				</table>
			</div>
		</div>
	);
};

LandingPage.getLayout = function (page) {
	return <Layout>{page}</Layout>;
};

LandingPage.getInitialProps = wrapper.getInitialPageProps((store) =>
	async (context) => {
		await store.dispatch(fetchTickets());

		return {};
	});

export default LandingPage;
