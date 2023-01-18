import { createSelector } from "@reduxjs/toolkit";
import { TicketsState } from "../slices/tickets";
import { AppState } from "../store";

const ticketsSliceSelector = (state: AppState): TicketsState => state.tickets;

export const selectTicketsList = createSelector(
	ticketsSliceSelector,
	(s) => s.tickets,
);

export const selectOneTicket = (id: string) =>
	createSelector(ticketsSliceSelector, (s) =>
		s.tickets.find((ticket) => ticket.id === id),
	);
