import { FormCard } from "../../components/FormCard";
import { ErrorCmp } from "../../components/Error";
import useRequest from "../../hooks/use-request";
import { setCurrentUser } from "../../slices/auth";
import { NextPageWithLayout } from "../_app";
import Router from "next/router";
import { FormEventHandler, useState } from "react";
import { useDispatch } from "react-redux";

export const SignIn: NextPageWithLayout = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();

	const { doRequest, errors } = useRequest<{ email: string; id: string }>({
		url: "/api/users/signin",
		method: "post",
		body: { email, password },
		onSuccess: (res) => {
			localStorage.setItem("user", JSON.stringify(res));
			dispatch(setCurrentUser({ currentUser: res }));
			Router.push("/");
		},
	});

	const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		doRequest();
	};

	return (
		<FormCard>
			<h2 className="text-2xl font-semibold text-center">Ticketing</h2>
			<form onSubmit={onSubmit} className="flex flex-col gap-4">
				<h1 className="text-xl font-semibold text-center">Sign In</h1>
				<div className="flex justify-between gap-2 items-center">
					<label htmlFor="email">Email Address</label>
					<input
						id="email"
						type="text"
						className="form-input"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="flex justify-between gap-2 items-center">
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						className="form-input"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				{errors && <ErrorCmp errors={errors} />}
				<button type="submit" className="btn btn-primary">
					Sign In
				</button>
			</form>
		</FormCard>
	);
};

export default SignIn;
