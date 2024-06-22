import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "users",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const sessionModel = model("sessions", sessionSchema);
export default sessionModel;
