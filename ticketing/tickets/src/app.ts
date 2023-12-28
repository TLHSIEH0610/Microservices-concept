import express from "express";
import { json } from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@arnietickets/common";
import cookieSession from "cookie-session";
import { createTicketRouter } from "../routes/new";
import { showTicketRouter } from "../routes/show";
import { indexTicketRouter } from "../routes";

const app = express();
app.set("trust proxy", true); //make sure that Express is aware that it's behind a proxy of Ingress-Nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, // do not encrypt.
    secure: process.env.NODE_ENV !== "test", //https only
  })
);
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
