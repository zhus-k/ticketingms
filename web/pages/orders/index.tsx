import useAxios from "../../api/useAxios";
import { Order } from "../../interface/Order";
import { NextPageContext } from "next";

interface OwnProps {
	orders: Order[];
}

const OrderIndex = ({ orders = [] }: OwnProps) => {
	const orderList = orders.map((order) => (
		<li key={order.id} className="flex gap-2">
			<span>{order.ticket.title}</span>
			<span>{order.status}</span>
		</li>
	));
	return (
		<div className="p-4">
			<div className="flex flex-col">
				<h2 className="text-lg font-bold">My Orders</h2>
				<ul>{orderList}</ul>
			</div>
		</div>
	);
};

OrderIndex.getInitialProps = async (context: NextPageContext) => {
	const axios = useAxios(context);
	const { data } = await axios.get("/api/orders");

	return { orders: data };
};

export default OrderIndex;
