import express from "express";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@arnietickets/common";

import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true); //make sure that Express is aware that it's behind a proxy of Ingress-Nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, // do not encrypt.
    secure: true, //https only
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
