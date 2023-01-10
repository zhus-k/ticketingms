import { AxiosInstance } from "axios";
import { AppContext } from "next/app";
import Link from "next/link";
import { _Props } from "../interface/appProps";
import { User } from "../interface/User";
import { Ticket } from "../interface/Ticket";

interface OwnProps extends _Props {
	tickets: Ticket[];
}

const LandingPage = ({ tickets }: OwnProps): JSX.Element => {
	const ticketList = tickets.map(
		(ticket: Ticket): JSX.Element => (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
				<td>
					<Link href="/tickets/ticketId" as={`/tickets/${ticket.id}`}>
						View
					</Link>
				</td>
			</tr>
		),
	);

	return (
		<div>
			<h1>Tickets</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>{ticketList}</tbody>
			</table>
		</div>
	);
};

LandingPage.getInitialProps = async (
	context: AppContext,
	client: AxiosInstance,
	currentUser: User,
): Promise<OwnProps> => {
	const { data } = await client.get("/api/tickets");

	return { tickets: data };
};

export default LandingPage;
