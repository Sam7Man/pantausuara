import CryptoJS from 'crypto-js';

export function encryptPassword(password) {
    const keyHex = import.meta.env.VITE_PASSWORD_KEY;
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(password, key, {
        iv, 
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.Pkcs7
    });

    const combined = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    return combined;
}
