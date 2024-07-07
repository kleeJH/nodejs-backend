import Joi from "joi";

const BaseJoi = Joi.defaults((schema) => {
    return schema.options({
        // Add common options here
        abortEarly: false, // Prevents Joi from stopping validation on the first error
        messages: {
            // Example custom error messages
            'any.required': '{#label} is required',
            'string.empty': '{#label} cannot be empty',
            'string.min': '{#label} should have at least {#limit} characters',
            'string.max': '{#label} should not exceed {#limit} characters',
            // Add more custom messages as needed
        }
    });
});

export default BaseJoi;