import crypto from 'crypto';

export function encrypt(content: string, password: string) {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);

    // Derive key from password using PBKDF2
    const key = crypto.pbkdf2Sync(password, iv, 100000, 32, 'sha256');

    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    // Encrypt content
    let encryptedData = cipher.update(content, 'utf8', 'base64');
    encryptedData += cipher.final('base64');

    // Get auth tag and append to encrypted data
    const authTag = cipher.getAuthTag();
    const encryptedBuffer = Buffer.concat([
        Buffer.from(encryptedData, 'base64'),
        authTag
    ]);

    return {
        encryptedData: encryptedBuffer.toString('base64'),
        iv: iv.toString('base64')
    };
}