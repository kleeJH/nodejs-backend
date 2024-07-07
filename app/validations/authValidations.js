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
        // .messages({
        //     'string.base': 'Username should be a string',
        //     'string.empty': 'Username cannot be empty',
        //     'string.min': 'Username should have at least {#limit} characters',
        //     'string.max': 'Username should not exceed {#limit} characters',
        //     'any.required': 'Username is required'
        // }),
        // password: Joi.string()
        //     .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) // Example password pattern
        //     .custom(joiValidateRSAEncrypted, 'RSA Encrypted Ciphertext Validation')
        //     .required()
        //     .messages({
        //         'string.base': 'Password should be a string',
        //         'string.pattern.base': 'Password must be alphanumeric and between 3 to 30 characters',
        //         'any.custom': 'Password must be an RSA-encrypted ciphertext',
        //         'any.required': 'Password is required'
        //     }),
        password: Joi.string().required()
    }),

    logIn: BaseJoi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        // .messages({
        //     'string.base': 'Username should be a string',
        //     'string.empty': 'Username cannot be empty',
        //     'string.min': 'Username should have at least {#limit} characters',
        //     'string.max': 'Username should not exceed {#limit} characters',
        //     'any.required': 'Username is required'
        // }),
        // password: Joi.string()
        //     .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) // Example password pattern
        //     .custom(joiValidateRSAEncrypted, 'RSA Encrypted Ciphertext Validation')
        //     .required()
        //     .messages({
        //         'string.base': 'Password should be a string',
        //         'string.pattern.base': 'Password must be alphanumeric and between 3 to 30 characters',
        //         'any.custom': 'Password must be an RSA-encrypted ciphertext',
        //         'any.required': 'Password is required'
        //     }),
        password: Joi.string().required()
    }),
}