import axios from "axios";
import { NextPageContext } from "next";

export default ({ req }: NextPageContext) => {
	if (typeof window === "undefined") {
		return axios.create({
			baseURL:
				process.env.NODE_ENV === "production"
					? "http://www.ppaxit.click/"
					: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
			headers: req?.headers,
		});
	} else {
		return axios.create();
	}
};
