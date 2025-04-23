import crypto from 'crypto';

export function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashed = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
    return { salt, hashed };
}

export function verifyPassword(password, salt, storedHash) {
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
    return hash === storedHash;
}
