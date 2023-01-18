import useAxios from "../api/useAxios";
import { User } from "../interface/User";
import { AppThunk } from "../store";
import { AnyAction, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface AuthState {
	currentUser: User | null;
}

const initialAuthState: AuthState = {
	currentUser: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialAuthState,
	reducers: {
		setCurrentUser(state, action: PayloadAction<AuthState>) {
			state.currentUser = action.payload.currentUser;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action: AnyAction) => {
			return {
				...state,
				...action.payload.auth,
			};
		});
	},
});

export const { setCurrentUser } = authSlice.actions;
export const reducers = authSlice.reducer;
export const name = authSlice.name;

// Thunks
export const fetchCurrentUser = (): AppThunk => async (dispatch) => {
	const axios = useAxios();
	const { data } = await axios.get<{ currentUser: User }>(
		"/api/users/currentuser",
	);
	dispatch(authSlice.actions.setCurrentUser(data));
};
