import "bootstrap/dist/css/bootstrap.css";
import { NextPage } from "next";
import { AppContext, AppProps as _AppProps } from "next/app";
import buildClient from "../api/buildClient";
import Header from "../components/header";
import { User } from "../interface/User";

interface OwnProps extends _AppProps {
	Component: NextPage;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	pageProps: any;
	currentUser?: User;
}

const AppComponent = ({
	Component,
	pageProps,
	currentUser,
}: OwnProps): JSX.Element => {
	return (
		<div>
			<Header currentUser={currentUser} />
			<div className="container">
				<Component {...pageProps} currentUser={currentUser} />
			</div>
		</div>
	);
};

AppComponent.getInitialProps = async (
	appContext: AppContext,
): Promise<OwnProps> => {
	const client = buildClient(appContext.ctx);
	const { data } = await client.get("/api/users/currentuser");

	let pageProps = {};
	if (appContext.Component.getInitialProps) {
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		pageProps = await (appContext.Component as any).getInitialProps(
			appContext.ctx,
			client,
			data.currentUser,
		);
	}

	return { pageProps, ...data };
};

export default AppComponent;
