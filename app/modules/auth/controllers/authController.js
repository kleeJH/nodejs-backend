import userCrud from "../../user/cruds/userCrud.js";
import responseUtils from "../../../common/utils/responseUtils.js";
import { generateAccessToken, generateRefreshToken } from "../../../common/utils/authUtils.js";
import { validateUsername, validatePassword, validateAndSaltHashPassword, verifyPassword } from "../../../common/utils/authUtils.js";
import { log } from "../../../common/utils/loggingUtils.mjs";
import { lucia } from "../../../lib/lucia.js";
import { AuthenticationError, AuthorizationError } from "../../../common/exceptions/exceptions.js";

// TODO: JWT Invalidate after logout
// TODO: User Group Access Control & Module Access Control
// TODO: Regenerate refresh token

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
      const username = validateUsername(req.body.username);
      const passwordPayload = validateAndSaltHashPassword(req.body.password);

      const signedUpUser = await userCrud.createUser(username, { username: username, ...passwordPayload }); // Check if username exists in here
      log.info(`User ${username} with id [${signedUpUser._id}] has been created.`);

      // Create Session (should I make a session in sign up or do it in login?)
      const session = await lucia.createSession(signedUpUser._id, {});
      res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());

      responseUtils.successHandler(res, signedUpUser);
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  },

  /**
   * Logs in a user.
   *
   * @param {import('express').Request} req - The request object.
   * @param {import('express').Response} res - The response object.
   * @return {Promise<void>} A promise that resolves when the user is logged in.
   */
  async logIn(req, res) {
    try {
      const username = validateUsername(req.body.username);
      const passwordUnhashed = validatePassword(req.body.password);

      let user = await userCrud.findUserByKey({ username: username });

      if (!verifyPassword(passwordUnhashed, user.hashedPassword)) {
        throw new AuthenticationError("Invalid username or password");
      }

      const session = await lucia.createSession(user._id, {});

      const tokenPayload = {
        accessToken: await generateAccessToken(user),
        refreshToken: await generateRefreshToken(user)
      }

      user = user.toObject();
      user.token = tokenPayload;

      res
        .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
        .appendHeader("Location", "/")

      responseUtils.successHandler(res, user);
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  },

  /**
   * Logs out the user by invalidating the session and redirecting to the login page.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} A promise that resolves when the user is logged out.
   */
  async logOut(req, res) {
    try {
      if (!res.locals.session) { // res or req?
        throw new AuthorizationError("Session not found");
      }

      await lucia.invalidateSession(res.locals.session.id);

      res.setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());

      // TODO: Invalidate JWT

      responseUtils.successHandler(res, "Logged out successfully");
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  },

  async test(req, res) {
    try {
      responseUtils.successHandler(res, 'test');
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  }
};
