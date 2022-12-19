const OrderIndex = ({ orders }) => {
	const orderList = orders.map((order) => (
		<li key={order}>
			{order.ticket.title} - {order.status}
		</li>
	));
	return (
		<div>
			<h1>My Orders</h1>
			<ul>{orderList}</ul>
		</div>
	);
};

OrderIndex.getInitialProps = async (context, client) => {
	const { data } = await client.get("/api/orders");

	return { orders: data };
};

export default OrderIndex;
