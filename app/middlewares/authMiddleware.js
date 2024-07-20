import responseUtils from "../common/utils/responseUtils.js";
import userCrud from "../modules/user/cruds/userCrud.js";
import userTokenCrud from "../modules/auth/cruds/userTokenCrud.js";
import Joi from "joi";
import { verifyAccessToken, verifyRefreshToken } from "../common/utils/authUtils.js";
import { ValidationError, AuthorizationError } from "../common/exceptions/exceptions.js";
import { log } from "../common/utils/loggingUtils.mjs";

/**
 * Validates the request body using the provided Joi object.
 *
 * @param {Joi.ObjectPropertiesSchema} JoiObject - The Joi object used for validation.
 * @returns {Function} - The middleware function.
 */
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
 * Validates the session and JWT for the user.
 *
 * @param {import('express').Request} req - The request object
 * @param {import('express').Response} res - The response object
 * @param {import('express').NextFunction} next - The next middleware function
 * @return {Promise<void>} - Promise that resolves when validation is complete
 */
function validateJwtAccessToken() {
    return async (req, res, next) => {
        try {
            // Check auth header
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                throw new AuthorizationError("Authorization access token not found");
            }

            // Verify access token
            const payload = await verifyAccessToken(token);

            // Store userId in req object
            const user = await userCrud.findUserById(payload.userId);
            req.userId = user._id;

            // Lucia Session
            // // Check if session are still valid
            // if (!res.locals.user || !res.locals.session) {
            //     throw new AuthorizationError("No session found");
            // }

            next();
        }
        catch (error) {
            return responseUtils.errorHandler(res, error);
        }
    }
}

function validateJwtRefreshToken() {
    return async (req, res, next) => {
        try {
            // Check auth header
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                throw new AuthorizationError("Authorization refresh token not found");
            }

            // Check if refresh token is valid
            const refreshToken = await userTokenCrud.getUserTokenByRefreshToken(token);

            // Verify access token
            const payload = await verifyRefreshToken(refreshToken.refreshToken);

            // Store userId in req object
            const user = await userCrud.findUserById(payload.userId);
            req.userId = user._id;

            // Lucia Session
            // // Check if session are still valid
            // if (!res.locals.user || !res.locals.session) {
            //     throw new AuthorizationError("No session found");
            // }

            next();
        }
        catch (error) {
            return responseUtils.errorHandler(res, error);
        }
    }
}

function validateAPIKey() {
    return async (req, res, next) => {
        try {
            const xApiKey = req.headers['x-api-key'];

            if (!xApiKey || xApiKey !== process.env.API_KEY) {
                throw new AuthorizationError("Invalid API key");
            }

            next();
        }
        catch (error) {
            log.error(error.message);
            return responseUtils.errorHandler(res, error);
        }
    }
}

export { validateReqBody, validateJwtAccessToken, validateJwtRefreshToken, validateAPIKey }