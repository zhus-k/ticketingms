import { combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { authSlice, ticketsSlice } from "./slices";

const reducers = {
	[authSlice.name]: authSlice.reducers,
	[ticketsSlice.name]: ticketsSlice.reducers,
};

const reducer = combineReducers(reducers);

const makeStore = () =>
	configureStore({
		reducer,
		devTools: true,
	});

type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);
