import useAxios from "../../api/useAxios";
import { FormCard } from "../../components/FormCard";
import useRequest from "../../hooks/use-request";
import { Order } from "../../interface/Order";
import { selectCurrentUserData } from "../../selectors/auth";
import { fetchCurrentUser } from "../../slices/auth";
import { wrapper } from "../../store";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StripeCheckout from "react-stripe-checkout";

interface OwnProps {
	order: Order;
}

const OrderShow = ({ order }: OwnProps) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const currentUser = useSelector(selectCurrentUserData);

	const { doRequest, errors } = useRequest({
		url: "/api/payments",
		method: "post",
		body: { orderId: order.id },
		onSuccess: () => Router.push("/orders"),
	});

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();

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
		<FormCard>
			<div className="flex flex-col items-start gap-2">
				<h2 className="text-xl font-semibold text-center">
					Time remaining to complete order: {timeLeft} seconds
				</h2>
				<StripeCheckout
					token={({ id }) => doRequest({ token: id })}
					stripeKey="pk_test_51MFOCNH7cz8U3cM3Zr4chZQbvOcGcPyuF8V5zLy3JrdDjoBbrGUMYUuEY7CP5zNswLPV1QdzB9TXJFrDqD92PPHe00SjPHzM7K"
					amount={parseFloat(order.ticket.price) * 100}
					email={currentUser?.email}
				/>
				{errors}
			</div>
		</FormCard>
	);
};

OrderShow.getInitialProps = wrapper.getInitialPageProps((store) =>
	async (context) => {
		const client = useAxios(context);
		const { orderId } = context.query;

		const { data } = await client.get(`/api/orders/${orderId}`);
		return { order: data };
	});

export default OrderShow;
