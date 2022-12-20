import axios from "axios";

export default ({ req }) => {
	if (typeof window === "undefined") {
		return axios.create({
			baseURL: "http://www.ppaxit.click/",
			headers: req.headers,
		});
	} else {
		return axios.create();
	}
};
