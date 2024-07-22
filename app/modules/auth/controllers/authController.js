import userCrud from "../../user/cruds/userCrud.js";
import responseUtils from "../../../common/utils/responseUtils.js";
import { generateAccessToken, generateRefreshToken } from "../../../common/utils/authUtils.js";
import { validateUsername, validatePassword, validateAndSaltHashPassword, verifyPassword } from "../../../common/utils/authUtils.js";
import { log } from "../../../common/utils/loggingUtils.mjs";
// import { lucia } from "../../../lib/lucia.js";
import { AuthenticationError } from "../../../common/exceptions/exceptions.js";
import userTokenCrud from "../cruds/userTokenCrud.js";
import { ROLE_TYPE } from "../../../common/enums/authEnumTypes.js";

export default {
  /**
   * Signs up a user.
   *
   * @param {import('express').Request} req - The request object.
   * @param {import('express').Response} res - The response object.
   * @return {Promise<void>} A promise that resolves when the user is signed up.
   */
  async signUpPassword(req, res) {
    try {
      const username = validateUsername(req.body.username);
      const passwordPayload = validateAndSaltHashPassword(req.body.password);

      const signedUpUser = await userCrud.createUser(username, { username: username, roleName: ROLE_TYPE.USER, isActive: true, ...passwordPayload }); // Check if username exists in here
      log.info(`User ${username} with id [${signedUpUser._id}] has been created.`);

      // Lucia Session
      // const session = await lucia.createSession(signedUpUser._id, {});
      // res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());

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
  async logInPassword(req, res) {
    try {
      const username = validateUsername(req.body.username);
      const userDecryptedPassword = validatePassword(req.body.password);

      let user = await userCrud.findUserByKey({ username: username });

      if (!verifyPassword(userDecryptedPassword, user.hashedPassword)) {
        user.loginFailedCount += 1;
        await user.save();
        throw new AuthenticationError("Invalid username or password");
      }

      // Update user
      user.lastLoginAt = new Date();
      user.loginCount += 1;
      user.loginFailedCount = 0;
      await user.save();

      const tokenPayload = {
        accessToken: await generateAccessToken(user),
        refreshToken: await generateRefreshToken(user)
      }

      user = user.toObject();
      user.token = tokenPayload;

      // Lucia Session
      // const session = await lucia.createSession(user._id, {});
      // res
      //   .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
      //   .appendHeader("Location", "/")

      responseUtils.successHandler(res, user);
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  },

  /**
   * Logs out the user by invalidating the refresh token and redirecting to the login page.
   *
   * @param {import('express').Request} req - The request object.
   * @param {import('express').Response} res - The response object.
   * @return {Promise<void>} A promise that resolves when the user is logged out.
   */
  async logOut(req, res) {
    try {
      // // Lucia Session
      // if (res.locals.session) {
      //   await lucia.invalidateSession(res.locals.session.id);
      //   res.setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
      // }

      // Invalidate refresh token
      await userTokenCrud.invalidateAllUserTokensByUserId(req.userId);

      responseUtils.successHandler(res, "Logged out successfully");
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  },

  /**
   * Refreshes the user's access token and generates a new refresh token.
   *
   * @param {import('express').Request} req - The request object.
   * @param {import('express').Response} res - The response object.
   * @return {Promise<void>} A promise that resolves when the refresh is complete.
   */
  async refreshToken(req, res) {
    try {
      const user = await userCrud.findUserById(req.userId);

      // Invalidate refresh token
      await userTokenCrud.invalidateAllUserTokensByUserId(user._id);

      const tokenPayload = {
        accessToken: await generateAccessToken(user),
        refreshToken: await generateRefreshToken(user)
      }

      responseUtils.successHandler(res, tokenPayload);
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  },

  async test(req, res) {
    try {
      console.log(req.userId)
      responseUtils.successHandler(res, 'test');
    } catch (error) {
      responseUtils.errorHandler(res, error);
    }
  }
};
