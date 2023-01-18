import { fetchCurrentUser } from "../slices/auth";
import { wrapper } from "../store";
import "../styles/globals.css";
import { NextPage } from "next";
import App, { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect } from "react";
import { Provider } from "react-redux";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const AppComponent = ({
	Component,
	...rest
}: Omit<AppPropsWithLayout, "pageProps">) => {
	const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

	const { store, props } = wrapper.useWrappedStore(rest);

	useEffect(() => {
		store.dispatch(fetchCurrentUser());
	}, []);

	return (
		<Provider store={store}>
			{getLayout(<Component {...props.pageProps} />)}
		</Provider>
	);
};

AppComponent.getInitialProps = wrapper.getInitialAppProps((store) =>
	async (appContext) => {
		return {
			pageProps: {
				...(await App.getInitialProps(appContext)).pageProps,
			},
		};
	});

export default AppComponent;
