import userCrud from "../../user/cruds/userCrud.js";
import { rsaDecrypt } from "../../../common/utils/authUtils.js";
import responseUtils from "../../../common/utils/responseUtils.js";
import { UserInputError } from "../../../common/exceptions/exceptions.js";
import { log } from "../../../common/utils/loggingUtils.mjs";
import { hash } from "@node-rs/argon2";
import { lucia } from "../../../lib/lucia.js";
import { generateId } from "lucia";

export default {
  /**
   * Signs up a user.
   *
   * @param {import('express').Request} req - The request object.
   * @param {import('express').Response} res - The response object.
   * @return {Promise<void>} A promise that resolves when the user is signed up.
   */
  async signUp(req, res) {
    try {
      // Validate password (TODO: validate via Joi)
      const usernameRegex = /^[a-z0-9_-]+$/;
      const username = req.body.username ?? null;
      if (!username || username.length < 8 || username.length > 32 || !usernameRegex.test(username)) {
        throw new UserInputError("Invalid username. Username must be between 8 and 32 characters and only contain letters, numbers, hyphens, and underscores");
      }

      const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
      const password = req.body.password ?? null;
      // Decrypt password from frontend
      // const decryptedPassword = rsaDecrypt(password); // TODO: test this
      const decryptedPassword = password;

      if (!decryptedPassword || decryptedPassword.length < 6 || decryptedPassword.length > 32 || !passwordRegex.test(decryptedPassword)) {
        throw new UserInputError("Invalid password. Password must be between 8 and 32 characters and include at least one capital letter");
      }

      const passwordHash = await hash(decryptedPassword, {
        // Recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
      });

      const signedUpUser = await userCrud.createUser({ username: username, hashedPassword: passwordHash }); // Check if username exists in here
      log.info(`User ${username} with id [${signedUpUser._id}] has been created.`);

      // Create Session
      const session = await lucia.createSession(signedUpUser._id, {});
      res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());

      // TODO: Send access token and refresh token to frontend (JWT?)

      responseUtils.successHandler(res, signedUpUser);
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  },

  // login: async (req: Request, res: Response) => {},
};
