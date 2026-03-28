import CryptoJS from 'crypto-js';

// Simulated shared secret (In real E2EE, this would be derived from RSA/Diffie-Hellman)
const SECRET_KEY = "indichat_super_secret_master_key_2026";

export const encryptMessage = (text) => {
    if (!text) return "";
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptMessage = (ciphertext) => {
    if (!ciphertext) return "";
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText || "[Decryption Failed]";
    } catch (e) {
        return "[Encrypted Message]";
    }
};
