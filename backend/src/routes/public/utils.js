import crypto from "crypto";

/**
 * Проверяет валидность данных от Telegram Login Widget.
 *
 * @param {object} data — объект со всеми полями, пришедшими от Telegram (включая hash)
 * @param {string} botToken — токен вашего бота
 * @returns {boolean} — true, если хеш совпал, false иначе
 */
export function verifyTelegramAuth(data, botToken) {
    // Клонируем объект, чтобы не менять исходный
    const dataCopy = { ...data };

    // Извлекаем присланный хеш
    const { hash: receivedHash } = dataCopy;
    delete dataCopy.hash;

    // Сортируем ключи и собираем data_check_string
    const sortedKeys = Object.keys(dataCopy).sort();
    const dataCheckString = sortedKeys
        .map((key) => `${key}=${dataCopy[key]}`)
        .join('\n');

    // Генерируем секретный ключ: SHA-256 от botToken
    const secretKey = crypto
        .createHash('sha256')
        .update(botToken)
        .digest();

    // Вычисляем HMAC-SHA256(dataCheckString, secretKey)
    const hmac = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // Сравниваем HMAC с полученным хешем
    return hmac === receivedHash;
}
