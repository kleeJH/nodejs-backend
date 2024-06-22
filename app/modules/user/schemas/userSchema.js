import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: false,
  },
});

const userModel = model("users", userSchema);
export default userModel;

// export interface IUser {
//   _id: string;
//   username: string;
//   hashedPassword: string;
// }
