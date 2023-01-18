import useRequest from "../../hooks/use-request";
import { setCurrentUser } from "../../slices/auth";
import Router from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default () => {
	const dispatch = useDispatch();

	const { doRequest } = useRequest({
		url: "/api/users/signout",
		method: "post",
		body: {},
		onSuccess: (res) => {
			localStorage.setItem("user", JSON.stringify(res));
			dispatch(setCurrentUser({ currentUser: null }));
			Router.push("/");
		},
	});

	useEffect(() => {
		doRequest();
	}, []);

	return <div>Signing out</div>;
};
