import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "common";

import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes";
import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

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

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);

app.all("*", async () => {
	throw new NotFoundError();
});
app.use(errorHandler);

export { app };
