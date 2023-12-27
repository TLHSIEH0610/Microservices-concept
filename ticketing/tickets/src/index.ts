import mongoose from "mongoose";
import { app } from "./app";

const startup = async () => {
  try {
    //pre-check envirnment variables
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined!");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined!");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
  } catch (e) {
    console.error(e);
  }
  app.listen(3000, () => {
    console.log("listening to port 3000");
  });
};

startup();
