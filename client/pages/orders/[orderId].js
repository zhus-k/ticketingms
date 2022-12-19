import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0);

	const { doRequest, errors } = useRequest({
		url: "/api/payments",
		method: "post",
		body: { orderId: order.id },
		onSuccess: () => Router.push("/orders"),
	});

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date();

			setTimeLeft(Math.round(msLeft / 1000));
		};

		findTimeLeft();
		const timerId = setInterval(findTimeLeft, 1000);
		return () => {
			clearInterval(timerId);
		};
	}, []);

	if (timeLeft < 0) {
		return <div>Order expired</div>;
	}

	return (
		<div>
			<h1>Time remaining to complete order: {timeLeft} seconds</h1>
			<StripeCheckout
				token={({ id }) => doRequest({ token: id })}
				stripeKey="pk_test_51MFOCNH7cz8U3cM3Zr4chZQbvOcGcPyuF8V5zLy3JrdDjoBbrGUMYUuEY7CP5zNswLPV1QdzB9TXJFrDqD92PPHe00SjPHzM7K"
				amount={order.ticket.price * 100}
				email={currentUser.email}
			/>
			{errors}
		</div>
	);
};

OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query;

	const { data } = await client.get(`/api/orders/${orderId}`);
	return { order: data };
};

export default OrderShow;
