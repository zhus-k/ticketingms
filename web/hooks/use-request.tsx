import { useState } from "react";
import axios, { Axios, AxiosResponse } from "axios";

type AxiosRESTMethods<D> = {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	[K in keyof Axios]: Axios[K] extends (...args: any[]) => Promise<D>
		? K
		: never;
}[keyof Axios];

function func<ResponseData>({
	url,
	method,
	body = {},
	onSuccess,
	onError,
}: {
	url: string;
	method: AxiosRESTMethods<ResponseData>;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	body?: any;
	onSuccess?: (args: ResponseData) => void;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	onError?: (err: any) => void;
}) {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [errors, setErrors] = useState<any>(null);

	const doRequest = async (props = {}) => {
		try {
			setErrors(null);
			const response: AxiosResponse<ResponseData> = await axios[method](url, {
				...body,
				...props,
			});

			if (onSuccess) {
				onSuccess(response.data);
			}

			return response.data;
		} catch (err) {
			setErrors(err);

			if (onError) {
				onError(err);
			}
		}
	};

	return { doRequest, errors };
}

export default func;
