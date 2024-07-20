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

const Session = model("sessions", sessionSchema);
export default Session;
