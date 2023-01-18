import { AxiosError } from "axios";

interface ErrorMessage {
	message: string;
	field?: string;
}

export const ErrorCmp = ({
	errors,
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { errors: AxiosError<{ errors: any[] }> }) => {
	return (
		<div className="flex flex-col items-start mx-1 p-2 bg-red-200 rounded">
			<h4 className="font-semibold text-md">Oops...</h4>
			<ul>
				{errors.response?.data?.errors?.map((err: ErrorMessage) => (
					<li key={err.message}>{err.message}</li>
				))}
			</ul>
		</div>
	);
};
