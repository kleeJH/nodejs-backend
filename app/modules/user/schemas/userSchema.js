import BaseSchema from "../../../common/schemas/baseSchema.js";
import { Schema, model, Types } from "mongoose";

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
  lastLoginAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  loginCount: {
    type: Number,
    required: false,
    default: 0,
  },
  loginFailedCount: {
    type: Number,
    required: false,
    default: 0,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
});

userSchema.add(BaseSchema);

const User = model("users", userSchema);
export default User;

// export interface IUser {
//   _id: string;
//   username: string;
//   hashedPassword: string;
// }
