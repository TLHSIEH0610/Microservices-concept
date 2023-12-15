import express from "express";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import mongoose from "mongoose";
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

app.get("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const startup = async () => {
  try {
    //pre-check envirnment variables
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined!");
    }
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("DB connected");
  } catch (e) {
    console.error(e);
  }
  app.listen(3000, () => {
    console.log("listening to port 3000");
  });
};

startup();
