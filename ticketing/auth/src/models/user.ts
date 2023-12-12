import mongoose from "mongoose";

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

//add "build" method to userSchema
userSchema.statics.build = (attrs: UserAttr) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
