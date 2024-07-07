import mongoose from "mongoose";
// import userCrud from "../modules/user/cruds/userCrud.js";
// import { log } from "../common/utils/loggingUtils.mjs";
import { Lucia, TimeSpan } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
// import { IUser } from "../modules/user/schemas/userSchema.js";

// import { webcrypto } from "crypto";
// globalThis.crypto = webcrypto as Crypto;

const adapter = new MongodbAdapter(
  mongoose.connection.collection("sessions"),
  mongoose.connection.collection("users")
);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, "h"),
  sessionCookie: {
    name: "auth_session",
    expires: true,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  // getUserAttributes: async (userId) => {
  //   try {
  //     const user = await userCrud.findUserById(userId);
  //     return user ? user.toObject() : null;
  //   } catch (error) {
  //     log.error('Error fetching user:', error);
  //     return null;
  //   }
  // },
  getUserAttributes: (attributes) => {
    return {
      _id: attributes._id,
      username: attributes.username,
      hashedPassword: attributes.hashedPassword,
    };
  },
});

// declare module "lucia" {
//   interface Register {
//     Lucia: typeof lucia;
//     DatabaseUserAttributes: IUser;
//   }
// }
