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
      const username = req.body.username ?? null;
      if (!username || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
        throw new UserInputError("Invalid username");
      }

      // Validate if username already exists
      await userCrud.checkUserExists(username);

      const password = req.body.password ?? null;
      // Decrypt password from frontend
      // const decryptedPassword = rsaDecrypt(password); // TODO: test this
      const decryptedPassword = password;

      if (!decryptedPassword || decryptedPassword.length < 6 || decryptedPassword.length > 255) {
        throw new UserInputError("Invalid password");
      }

      const passwordHash = await hash(decryptedPassword, {
        // Recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
      });

      const signedUpUser = await userCrud.createUser({ username: username, hashedPassword: passwordHash });
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
