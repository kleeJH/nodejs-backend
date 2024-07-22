import Joi from "joi";
import BaseJoi from "./baseValidation.js";
import { joiValidateRSAEncrypted } from "../common/utils/authUtils.js";

export default {
    signUp: BaseJoi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .custom(joiValidateRSAEncrypted, 'RSA Encrypted Ciphertext Validation')
            .required(),
        // password: Joi.string().required()
    }),

    logIn: BaseJoi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .custom(joiValidateRSAEncrypted, 'RSA Encrypted Ciphertext Validation')
            .required(),
        // password: Joi.string().required()
    }),
}