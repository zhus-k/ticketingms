import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";

import {
	currentUser,
	errorHandler,
	NotFoundError,
} from "@zjs-tix/ticketingms-common-ts";
import { indexEventRouter } from "./routes";
import { createEventRouter } from "./routes/new";
import { showEventRouter } from "./routes/show";
import { updateEventRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
	cookieSession({
		signed: false,
		secure: false,
	}),
);
app.use(currentUser);

app.use(createEventRouter);
app.use(showEventRouter);
app.use(indexEventRouter);
app.use(updateEventRouter);

app.all("*", async () => {
	throw new NotFoundError();
});
app.use(errorHandler);

export { app };
