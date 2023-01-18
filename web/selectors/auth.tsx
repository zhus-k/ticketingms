import { createSelector } from "@reduxjs/toolkit";
import { AuthState } from "../slices/auth";
import { AppState } from "../store";

const authSliceSelector = (state: AppState): AuthState => state.auth;

export const selectCurrentUserData = createSelector(
	authSliceSelector,
	(s) => s.currentUser,
);
