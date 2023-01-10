import Router from "next/router";
import { FormEventHandler, useState } from "react";
import useRequest from "../../hooks/use-request";
import { Ticket } from "../../interface/Ticket";

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
		<div>
			<h1>Create a Ticket</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						id="title"
						className="form-control"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="price">Price</label>
					<input
						id="price"
						className="form-control"
						type="text"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						onBlur={onBlur}
					/>
				</div>
				{errors}
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default NewTicket;
