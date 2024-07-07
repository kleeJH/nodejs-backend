import fs from "fs";
import responseUtils from "./responseUtils.js";
import { publicEncrypt, privateDecrypt } from "crypto";
import { FileProcessingError, ValidationError } from "../exceptions/exceptions.js";

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
        throw new ValidationError(result.error.message);
      }

      next();
    } catch (error) {
      return responseUtils.errorHandler(res, error);
    }
  }
}

export {
  rsaEncrypt,
  rsaDecrypt,
  joiValidateRSAEncrypted,
  validateReqBody
};
