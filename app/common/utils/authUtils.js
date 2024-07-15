import fs from "fs";
import path from "path";
import responseUtils from "./responseUtils.js";
import { jwtVerify, SignJWT, importPKCS8, importSPKI } from "jose";
import { hashSync, verifySync } from "@node-rs/argon2";
import { publicEncrypt, privateDecrypt } from "crypto";
import { log } from "./loggingUtils.mjs";
import { FileProcessingError, ValidationError, UserInputError, DeveloperError, AuthorizationError } from "../exceptions/exceptions.js";

function rsaEncrypt(plaintext) {
  let publicKey;

  try {
    publicKey = fs.readFileSync("./keys/rsa_oaep_2048_public_key.pem");
  }
  catch (err) {
    throw new FileProcessingError("File not found: ./keys/rsa_oaep_2048_public_key.pem");
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
    privateKey = fs.readFileSync("./keys/rsa_oaep_2048_private_key.pem");
  }
  catch (err) {
    throw new FileProcessingError("File not found: ./keys/rsa_oaep_2048_private_key.pem");
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

/**
 * Generates an access token for a user.
 *
 * @param {Object} user - The user object for whom the access token is generated.
 * @return {Promise<string>} The generated access token.
 */
async function generateAccessToken(user) {
  // Load the private key from the PEM file
  const accessTokenPrivateKeyPem = fs.readFileSync(path.join("./keys", 'access_token_private_key.pem'), 'utf8');
  const accessTokenPrivateKey = await importPKCS8(accessTokenPrivateKeyPem, 'RS256');

  // Define the payload for the token
  const accessPayload = {
    username: user.username,
    scope: 'access'
  };

  // Define the expiration time
  const accessTokenExpiresIn = '15m'; // Access token expires in 15 minutes

  // Sign the tokens
  const accessToken = await new SignJWT(accessPayload)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setExpirationTime(accessTokenExpiresIn)
    .setIssuer(process.env.ISSUER)
    .setAudience(process.env.AUDIENCE)
    .sign(accessTokenPrivateKey);

  return accessToken;
}

/**
 * Generates a refresh token for a given user.
 *
 * @param {Object} user - The user object containing the username.
 * @return {Promise<string>} The generated refresh token.
 */
async function generateRefreshToken(user) {
  // Load the private key from the PEM file
  const refreshTokenPrivateKeyPem = fs.readFileSync(path.join("./keys", 'refresh_token_private_key.pem'), 'utf8');
  const refreshTokenPrivateKey = await importPKCS8(refreshTokenPrivateKeyPem, 'RS256');

  // Define the payload for the token
  const refreshPayload = {
    username: user.username,
    scope: 'refresh'
  };

  // Define the expiration time
  const refreshTokenExpiresIn = '7d'; // Refresh token expires in 7 days

  // Sign the tokens
  const refreshToken = await new SignJWT(refreshPayload)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setExpirationTime(refreshTokenExpiresIn)
    .setIssuer(process.env.ISSUER)
    .setAudience(process.env.AUDIENCE)
    .sign(refreshTokenPrivateKey);

  return refreshToken;
}

/**
 * Verifies an access token by decrypting it using the public key from the PEM file.
 *
 * @param {string} accessToken - The access token to be verified.
 * @return {Promise<import("jose").JWTPayload>} The payload of the verified access token.
 * @throws {AuthorizationError} If the access token is invalid.
 */
async function verifyAccessToken(accessToken) {
  // Load the public key from the PEM file
  const accessTokenPublicKeyPem = fs.readFileSync(path.join("./keys", 'access_token_public_key.pem'), 'utf8');
  const accessTokenPublicKey = await importSPKI(accessTokenPublicKeyPem, 'RS256');

  try {
    const { payload } = await jwtVerify(accessToken, accessTokenPublicKey, {
      issuer: process.env.ISSUER,
      audience: process.env.AUDIENCE,
    });

    return payload;
  } catch (error) {
    log.error(error.message);
    throw new AuthorizationError("Invalid access token");
  }
}

/**
 * Verifies a refresh token using the provided public key.
 *
 * @param {string} refreshToken - The refresh token to be verified.
 * @return {Promise<import("jose").JWTPayload>} The payload of the verified refresh token.
 * @throws {AuthorizationError} If the refresh token is invalid.
 */
async function verifyRefreshToken(refreshToken) {
  // Load the public key from the PEM file
  const refreshTokenPublicKeyPem = fs.readFileSync(path.join("./keys", 'refresh_token_public_key.pem'), 'utf8');
  const refreshTokenPublicKey = await importSPKI(refreshTokenPublicKeyPem, 'RS256');

  try {
    const { payload } = await jwtVerify(refreshToken, refreshTokenPublicKey, {
      issuer: process.env.ISSUER,
      audience: process.env.AUDIENCE,
    });

    return payload;
  } catch (error) {
    log.error(error.message);
    throw new AuthorizationError("Invalid refresh token");
  }
}

/**
 * Validates the session and JWT for the user.
 *
 * @param {import('express').Request} req - The request object
 * @param {import('express').Response} res - The response object
 * @param {import('express').NextFunction} next - The next middleware function
 * @return {Promise<void>} - Promise that resolves when validation is complete
 */
function validateSessionAndJwt() {
  return async (req, res, next) => {
    try {
      if (!res.locals.user || !res.locals.session) {
        throw new AuthorizationError("No session found");
      }

      // Check auth header
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
        throw new AuthorizationError("No authorization token found");
      }

      // Verify access token
      const accessToken = authHeader.split(' ')[1];
      const payload = await verifyAccessToken(accessToken);
      req.user = payload;

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
  generateAccessToken,
  generateRefreshToken,
  validateSessionAndJwt
};
