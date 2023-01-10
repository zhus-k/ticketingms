import { AxiosInstance } from "axios";
import { NextPageContext } from "next";
import { Order } from "../../interface/Order";

interface OwnProps {
	orders: Order[];
}

const OrderIndex = ({ orders }: OwnProps) => {
	const orderList = orders.map((order) => (
		<li key={order.id}>
			{order.ticket.title} -- {order.status}
		</li>
	));
	return (
		<div>
			<h1>My Orders</h1>
			<ul>{orderList}</ul>
		</div>
	);
};

OrderIndex.getInitialProps = async (
	context: NextPageContext,
	client: AxiosInstance,
) => {
	const { data } = await client.get("/api/orders");

	return { orders: data };
};

export default OrderIndex;
