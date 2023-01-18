import { FormCard } from "../../components/FormCard";
import { ErrorCmp } from "../../components/Error";
import useRequest from "../../hooks/use-request";
import { Ticket } from "../../interface/Ticket";
import Router from "next/router";
import { FormEventHandler, useState } from "react";

const NewTicket = (): JSX.Element => {
	const [title, setTitle] = useState("");
	const [price, setPrice] = useState("");
	const { doRequest, errors } = useRequest({
		url: "/api/tickets",
		method: "post",
		body: { title, price },
		onSuccess: (ticket: Ticket) => {
			Router.push("/");
		},
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		onError: (error: any) => {},
	});

	const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		doRequest();
	};

	const onBlur = () => {
		const value = parseFloat(price);

		if (isNaN(value)) {
			return;
		}

		setPrice(value.toFixed(2));
	};

	return (
		<FormCard>
			<h2 className="text-2xl font-semibold text-center">List a Ticket</h2>
			<form onSubmit={onSubmit} className="flex flex-col gap-4">
				<div className="flex justify-between gap-2 items-center">
					<label htmlFor="title">Item</label>
					<input
						id="title"
						className="form-input"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className="flex justify-between gap-2 items-center">
					<label htmlFor="price">Price</label>
					<input
						id="price"
						className="form-input"
						type="text"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						onBlur={onBlur}
					/>
				</div>
				{errors && <ErrorCmp errors={errors} />}
				<button type="submit" className="btn btn-primary">
					List
				</button>
			</form>
		</FormCard>
	);
};

export default NewTicket;
