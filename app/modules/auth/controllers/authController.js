import userCrud from "../../user/cruds/userCrud.js";
import { validateUsername, validatePassword, verifyPassword } from "../../../common/utils/authUtils.js";
import responseUtils from "../../../common/utils/responseUtils.js";
// import express from "express";
// const { Request, Response } = express;
import { log } from "../../../common/utils/loggingUtils.mjs";
import { lucia } from "../../../lib/lucia.js";
import { AuthenticationError, AuthorizationError } from "../../../common/exceptions/exceptions.js";

// TODO: User Group
// TODO: JWT
// TODO: User Access Control & Module Access Control

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
      const passwordHash = validatePassword(req.body.password, true);

      const signedUpUser = await userCrud.createUser({ username: username, hashedPassword: passwordHash }); // Check if username exists in here
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
      const passwordUnhashed = validatePassword(req.body.password, false);

      const user = await userCrud.findUserByKey({ username: username });

      if (!verifyPassword(passwordUnhashed, user.hashedPassword)) {
        throw new AuthenticationError("Invalid username or password");
      }

      const session = await lucia.createSession(user._id, {});

      // TODO: Create JWT (Access token and refresh token)

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
      if (!res.locals.session) {
        throw new AuthorizationError("Session not found");
      }

      // TODO: Check if there is JWT

      await lucia.invalidateSession(res.locals.session.id);

      res.setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());

      // TODO: Invalidate JWT

      responseUtils.redirectHandler(res, "/login");
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  }
};
