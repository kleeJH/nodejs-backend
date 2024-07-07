import fs from "fs";
import responseUtils from "./responseUtils.js";
import { lucia } from "../../lib/lucia.js";
import { hashSync, verifySync } from "@node-rs/argon2";
import { publicEncrypt, privateDecrypt } from "crypto";
import { FileProcessingError, ValidationError, UserInputError, DeveloperError, AuthorizationError } from "../exceptions/exceptions.js";

function rsaEncrypt(ciphertext) {
  let publicKey;

  try {
    publicKey = fs.readFileSync("./keys/rsa_2048_public.pem");
  }
  catch (err) {
    throw new FileProcessingError("File not found: ./keys/rsa_2048_public.pem");
  }

  const encrypted = publicEncrypt(
    publicKey,
    Buffer.from(plaintext)
  );

  return encrypted.toString("base64");
}

function rsaDecrypt(ciphertext) {
  let privateKey;

  try {
    privateKey = fs.readFileSync("./keys/rsa_2048_private.pem");
  }
  catch (err) {
    throw new FileProcessingError("File not found: ./keys/rsa_2048_private.pem");
  }

  const decrypted = privateDecrypt(
    privateKey,
    Buffer.from(ciphertext, "base64")
  );

  return decrypted.toString("utf8");
}

/**
 * Validates a username.
 *
 * @param {string} username - The username to be validated.
 * @throws {UserInputError} If the username is invalid.
 * @return {string} The validated username.
 */
function validateUsername(username) {
  // Validate username
  username = username ?? null;
  const usernameRegex = /^[a-z0-9_-]+$/;
  if (!username || username.length < 5 || username.length > 32 || !usernameRegex.test(username)) {
    throw new UserInputError("Invalid username. Username must be between 5 and 32 characters and only contain letters, numbers, hyphens, and underscores");
  }

  return username;
}

/**
 * Validates a password.
 *
 * @param {string} password - The password to be validated.
 * @param {boolean} [doHash=false] - Indicates whether the final outcome of the password should be hashed.
 * @throws {UserInputError} If the password is invalid.
 * @return {string} The password hashed if `doHash` is `true`, otherwise the decrypted password.
 */
function validatePassword(password, doHash = false) {
  const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
  password = password ?? null;
  // Decrypt password from frontend
  // const decryptedPassword = rsaDecrypt(password); // TODO: test this
  const decryptedPassword = password;

  if (!decryptedPassword || decryptedPassword.length < 6 || decryptedPassword.length > 32 || !passwordRegex.test(decryptedPassword)) {
    throw new UserInputError("Invalid password. Password must be between 8 and 32 characters and include at least one capital letter");
  }

  if (!doHash) {
    return decryptedPassword;
  }

  const passwordHash = hashSync(decryptedPassword, {
    // Recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  return passwordHash;
}

/**
 * Verify the user-entered password against the stored password hash.
 *
 * @param {string} userSentPassword - The password entered by the user.
 * @param {string} storedPasswordHash - The hashed password stored in the database.
 * @return {boolean} Indicates whether the user-entered password is valid.
 */
async function verifyPassword(userSentPassword, storedPasswordHash) {
  if (!userSentPassword) {
    throw new UserInputError("User password must not be empty");
  }

  if (!storedPasswordHash) {
    throw new DeveloperError("Stored password must not be empty");
  }

  // Decrypt password from frontend
  // const decryptedPassword = rsaDecrypt(userSentPassword); // TODO: test this
  const decryptedUserSentPassword = userSentPassword;

  const isValidPassword = verifySync(storedPasswordHash, decryptedUserSentPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  return isValidPassword;
}

function joiValidateRSAEncrypted(value, helpers) {
  try {
    const decrypted = rsaDecrypt(value);
    return decrypted ? value : helpers.error('any.invalid');
  } catch (error) {
    return helpers.error('any.invalid');
  }
}

function validateReqBody(JoiObject) {
  return async (req, res, next) => {
    try {
      const result = await JoiObject.validate(req.body);

      if (result.error) {
        const errorMessages = result.error.details.map(detail => detail.message);
        throw new ValidationError(errorMessages);
      }

      next();
    } catch (error) {
      return responseUtils.errorHandler(res, error);
    }
  }
}

function validateSessionAndJwt() {
  return async (req, res, next) => {
    try {
      // console.log(`req.locals.user: ${req.locals.user}`);
      // console.log(`req.locals.session: ${req.locals.session}`);

      if (!res.locals.user || !res.locals.session) {
        throw new AuthorizationError("Unauthorized");
      }

      // await lucia.validateSession(res.locals.session.id); // already validated in server.js
      // TODO: Check if there is JWT and validate
      next();
    }
    catch (error) {
      return responseUtils.errorHandler(res, error);
    }
  }

}

export {
  rsaEncrypt,
  rsaDecrypt,
  validateUsername,
  validatePassword,
  verifyPassword,
  joiValidateRSAEncrypted,
  validateReqBody,
  validateSessionAndJwt
};
