import { randomUUID, publicEncrypt, privateDecrypt } from "crypto";
import fs from "fs";
import { FileProcessingError } from "../exceptions/exceptions";

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

export {
  rsaEncrypt,
  rsaDecrypt
};
