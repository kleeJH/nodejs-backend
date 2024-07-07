import Joi from "joi";

const BaseJoi = Joi.defaults((schema) => {
    return schema.options({
        // Add common options here
        abortEarly: false, // Prevents Joi from stopping validation on the first error
        errors: {
            wrap: {
                label: "<>", // Remove quotes around labels
            }
        },
        messages: {
            // Example custom error messages
            'any.required': '{#label} is required',
            'any.only': '{#label} must be one of the following values: {#valids}',
            'any.invalid': '{#label} contains an invalid value',
            'any.empty': '{#label} cannot be empty',
            'any.default': '{#label} has an invalid default value',

            'string.empty': '{#label} cannot be empty',
            'string.min': '{#label} should have at least {#limit} characters',
            'string.max': '{#label} should not exceed {#limit} characters',
            'string.length': '{#label} should be {#limit} characters long',
            'string.email': '{#label} must be a valid email',
            'string.uri': '{#label} must be a valid URI',
            'string.guid': '{#label} must be a valid GUID',
            'string.hex': '{#label} must only contain hexadecimal characters',
            'string.alphanum': '{#label} must only contain alphanumeric characters',
            'string.token': '{#label} must only contain alphanumeric and underscore characters',
            'string.pattern.base': '{#label} format is invalid',
            'string.pattern.name': '{#label} does not match the {#name} pattern',

            'number.base': '{#label} must be a number',
            'number.min': '{#label} should be at least {#limit}',
            'number.max': '{#label} should be less than or equal to {#limit}',
            'number.less': '{#label} should be less than {#limit}',
            'number.greater': '{#label} should be greater than {#limit}',
            'number.integer': '{#label} must be an integer',
            'number.positive': '{#label} must be a positive number',
            'number.negative': '{#label} must be a negative number',
            'number.precision': '{#label} must have no more than {#limit} decimal places',
            'number.multiple': '{#label} must be a multiple of {#multiple}',

            'boolean.base': '{#label} must be a boolean',

            'array.base': '{#label} must be an array',
            'array.min': '{#label} should have at least {#limit} items',
            'array.max': '{#label} should have less than or equal to {#limit} items',
            'array.length': '{#label} should contain {#limit} items',
            'array.unique': '{#label} must contain unique values',

            'object.base': '{#label} must be an object',
            'object.min': '{#label} must have at least {#limit} keys',
            'object.max': '{#label} must have less than or equal to {#limit} keys',

            'date.base': '{#label} must be a valid date',
            'date.format': '{#label} must be in {#format} format',
            'date.min': '{#label} must be greater than or equal to {#limit}',
            'date.max': '{#label} must be less than or equal to {#limit}',

            'binary.base': '{#label} must be a binary buffer',
            'binary.min': '{#label} must have at least {#limit} bytes',
            'binary.max': '{#label} must have less than or equal to {#limit} bytes',
            'binary.length': '{#label} must have {#limit} bytes',

            // Add more custom messages as needed
        }
    });
});

export default BaseJoi;