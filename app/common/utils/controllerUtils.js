import { DeveloperError } from "../exceptions/exceptions.js";
import Response from "./responseUtils.js";

export default {
    async defaultController(execute, res) {
        try {
            let result = null;

            // Determine execute type
            if (execute && typeof execute.then === 'function') {
                result = await execute;
            } else if (typeof execute === 'function') {
                result = execute();

                // If the function returns a Promise, await it
                if (result && typeof result.then === 'function') {
                    result = await result;
                }
            } else if (typeof execute === 'string' || execute instanceof String) {
                result = execute;
            } else {
                throw new DeveloperError('Invalid type for execute: Must be a Promise, a function, or a String');
            }

            Response.successHandler(res, result);
        } catch (error) {
            Response.errorHandler(res, error);
        }
    },
}