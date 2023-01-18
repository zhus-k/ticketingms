import useAxios from "../api/useAxios";
import { Ticket } from "../interface/Ticket";
import { AppThunk } from "../store";
import { AnyAction, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface TicketsState {
	tickets: Ticket[];
}

const initialTicketState: TicketsState = {
	tickets: [],
};

export const ticketsSlice = createSlice({
	name: "tickets",
	initialState: initialTicketState,
	reducers: {
		setTickets(state, action: PayloadAction<TicketsState>) {
			state.tickets = action.payload.tickets ?? [];
		},
	},
	extraReducers: (builder) => {
		builder.addCase(HYDRATE, (state, action: AnyAction) => {
			return {
				...state,
				...action.payload.tickets,
			};
		});
	},
});

export const { setTickets } = ticketsSlice.actions;
export const reducers = ticketsSlice.reducer;
export const name = ticketsSlice.name;

// Thunks
export const fetchTickets = (): AppThunk => async (dispatch) => {
	const axios = useAxios();
	const { data } = await axios.get<Ticket[]>("/api/tickets");
	dispatch(
		ticketsSlice.actions.setTickets({
			tickets: data ?? [],
		}),
	);
};
