import mongoose from "mongoose";
import { Password } from "../services/passwrod";

//tell TS the User Attr
interface UserAttr {
  email: string;
  password: string;
}

//tell TS there is a build method
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttr): UserDoc;
}

//Mongoose model properties
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

//add "build" method to userSchema
userSchema.statics.build = (attrs: UserAttr) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
