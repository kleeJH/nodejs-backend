import { DeveloperError } from "../exceptions/exceptions.js";

async function renderHTMLTemplate(
    filePath,
    args) {
    const templateFile = await fs.readFile(filePath);
    let template = templateFile.toString("utf-8");
    for (const key in args) {
        template = template.replaceAll(`%${key}%`, args[key]);
    }
    return template;
}

/**
 * Converts a buffer to a base64 encoded string.
 *
 * @param {Buffer} buffer - The buffer to convert.
 * @return {string} The base64 encoded string.
 */
function bufferToBase64(buffer) {
    return buffer.toString('base64');
}

/**
 * Converts a base64 encoded string to a buffer.
 *
 * @param {string} base64String - The base64 encoded string to convert.
 * @return {Buffer} The buffer containing the decoded data.
 */
function base64ToBuffer(base64String) {
    return Buffer.from(base64String, 'base64');
}

/**
 * Generates a mongo id from a string.
 *
 * @param {string} str - description of parameter
 * @return {string} string of mongo id
 */
function generateGenericMongoId(str) {
    if (str.length > 24) {
        throw new DeveloperError("String must not be longer than 24 characters");
    } else {
        return "0".repeat(24 - str.length) + str;
    }
}

export { renderHTMLTemplate, bufferToBase64, base64ToBuffer, generateGenericMongoId }