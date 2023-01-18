import axios, { AxiosInstance } from "axios";
import { NextPageContext } from "next";

export default (context?: NextPageContext) => {
	const req = context?.req;
	let axiosInst: AxiosInstance;
	if (typeof window === "undefined") {
		const baseURL =
			process.env.NODE_ENV === "production"
				? "http://www.ppaxit.click/"
				: process.env.HOST === "cluster"
				? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
				: "http://localhost:4000";

		axiosInst = axios.create({
			baseURL,
			headers: req?.headers,
		});
	} else {
		axiosInst = axios.create();
	}

	axiosInst.interceptors.response.use(
		(response) => {
			let responseCopy = { ...response };

			return responseCopy;
		},
		(err) => {
			return Promise.reject(err);
		},
	);

	return axiosInst;
};
