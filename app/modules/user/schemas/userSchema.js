import { Schema, model, Types } from "mongoose";
import BaseSchema from "../../../common/schemas/baseSchema.js";

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: Types.ObjectId,
  },
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: false,
    default: null,
  },
  passwordSalt: {
    type: String,
    required: false,
    default: "",
  },
});

userSchema.add(BaseSchema);

const userModel = model("users", userSchema);
export default userModel;

// export interface IUser {
//   _id: string;
//   username: string;
//   hashedPassword: string;
// }
