// import crypto from 'crypto-browserify';
// import { Buffer } from 'buffer';

// export function encryptPassword(password) {
//     const keyHex = import.meta.env.VITE_PASSWORD_KEY;
//     const key = Buffer.from(keyHex, 'hex');
//     const plaintext = Buffer.from(password);

//     const iv = crypto.randomBytes(16);
//     const cipher = crypto.createCipheriv('aes-256-cfb', key, iv);

//     let encrypted = cipher.update(plaintext, 'utf8', 'base64');
//     encrypted += cipher.final('base64');

//     const ciphertext = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');
//     return ciphertext;
// }

import crypto from 'crypto';
import { Buffer } from 'buffer';

export function encryptPassword(password) {
    const keyHex = import.meta.env.VITE_PASSWORD_KEY;
    const key = Buffer.from(keyHex, 'hex');
    const plaintext = Buffer.from(password);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cfb', key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const ciphertext = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');

    return ciphertext;
}
