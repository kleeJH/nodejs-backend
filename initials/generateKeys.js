// This file is not used for any reference to other files
// It is just used to generate key pairs using the jose package


import { generateKeyPair, exportPKCS8, exportSPKI } from "jose";
import fs from "fs";

async function generateRS256AndSaveKeyPair(keyPairName) {
    // Generate a key pair
    const { publicKey, privateKey } = await generateKeyPair('RS256');

    // Export the public key in SPKI format (PEM)
    const publicKeyPem = await exportSPKI(publicKey);

    // Export the private key in PKCS8 format (PEM)
    const privateKeyPem = await exportPKCS8(privateKey);

    // Save the keys to PEM files
    fs.writeFileSync(`./keys/${keyPairName}_public_key.pem`, publicKeyPem);
    fs.writeFileSync(`./keys/${keyPairName}_private_key.pem`, privateKeyPem);

    console.log('RS256 JWT Sign Public and private keys have been saved as PEM files.');
}

async function generateRSA2048AndSaveKeyPair(keyPairName) {
    // Generate a key pair
    const { publicKey, privateKey } = await generateKeyPair('RSA-OAEP', { modulusLength: 2048 });

    // Export the public key in SPKI format (PEM)
    const publicKeyPem = await exportSPKI(publicKey);

    // Export the private key in PKCS8 format (PEM)
    const privateKeyPem = await exportPKCS8(privateKey);

    // Save the keys to PEM files
    fs.writeFileSync(`./keys/${keyPairName}_public_key.pem`, publicKeyPem);
    fs.writeFileSync(`./keys/${keyPairName}_private_key.pem`, privateKeyPem);

    console.log('RSA2048 Public and private keys have been saved as PEM files.');
}

// Create the 'keys' directory if it doesn't exist
fs.existsSync('./keys') || fs.mkdirSync('./keys');

// Generate and save the key pairs 
generateRS256AndSaveKeyPair('access_token').catch(console.error);
generateRS256AndSaveKeyPair('refresh_token').catch(console.error);
generateRSA2048AndSaveKeyPair('rsa_oaep_2048').catch(console.error);