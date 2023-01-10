import { useState } from "react";
import axios, { Axios, AxiosResponse } from "axios";

type AxiosRESTMethods<D> = {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	[K in keyof Axios]: Axios[K] extends (...args: any[]) => Promise<D> ? K : never;
}[keyof Axios];

function func<RequestBody, ResponseData, Method extends AxiosRESTMethods<ResponseData>>({
	url,
	method,
	body,
	onSuccess,
}: {
	url: string;
	method: Method;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	body: RequestBody;
	onSuccess: (args: ResponseData) => void;
}) {
	const [errors, setErrors] = useState<JSX.Element | null>(null);

	const doRequest = async (props = {}) => {
		try {
			setErrors(null);
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
			const response: AxiosResponse<ResponseData> = await axios[method](url, {
				...body,
				...props,
			});

			if (onSuccess) {
				onSuccess(response.data);
			}

			return response.data;
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (err: any) {
			setErrors(
				<div className="alert alert-danger">
					<h4>Oops...</h4>
					<ul className="my-0">
						{err.response.data.errors.map((err: Error) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>,
			);
		}
	};

	return { doRequest, errors };
}

export default func;
