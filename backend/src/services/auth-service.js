import {
    closeSessionRepo, getOpenSessionByAccessTokenRepo,
    saveSessionRepo,
} from '../repositories/session-repository.js';
import {
    findByTelegramIdRepo,
    getUserByLoginRepo,
    getMaxIdRepo,
    insertTelegramUserRepo,
    addUserRepo,
} from '../repositories/user-repository.js';
import { generateToken } from './utils/auth-utils.js';
import { hashPassword, verifyPassword } from './utils/password-utils.js';
import { verifyTelegramAuth } from './utils/telegram-utils.js';


export async function createSession(db, {userAgent, userIP, userId} ) {
    const access = generateToken();
    const refresh = generateToken();

    await saveSessionRepo(db, {
        userId,
        userAgent,
        userIP,
        access,
        refresh,
    });

    return { access, refresh };
}

export async function createUser(db, { login, password, name, passwordHint, email }) {
    const { salt, hashed } = hashPassword(password);
    const user = await addUserRepo(db, { login, pass: hashed, salt, name, passwordHint, email });
    return user.id;
}

export async function verifyLoginUser(db, login, password) {
    const user = await getUserByLoginRepo(db, login);
    if (!user || !verifyPassword(password, user.salt, user.pass)) {
        throw new Error('INVALID_CREDENTIALS');
    }
    return user.id;
}

export async function logoutUser(db, conf, accessToken) {
    const session = getOpenSessionByAccessTokenRepo(db, conf, accessToken)
    if (!session) throw new Error('SESSION_NOT_FOUND');
    await closeSessionRepo(db, accessToken);
}


export async function getUserByTelegramAuth(db, botToken, tg) {
    const { telegramId, username, firstName, lastName } = {
        telegramId: tg.id,
        username: tg.username,
        firstName: tg.first_name,
        lastName: tg.last_name,
        photoUrl: tg.photo_url,
    };
    if (!verifyTelegramAuth(tg, botToken)) {
        throw new Error('INVALID_HASH');
    }
    let user = await findByTelegramIdRepo(db, telegramId);
    let isNew = false;
    if (!user) {
        const newLogin = username || `user${(await getMaxIdRepo()) + 1}`;
        const newName = `${firstName}${lastName ? ' ' + lastName : ''}`;
        user = await insertTelegramUserRepo(db, { login: newLogin, name: newName, telegramId });
        isNew = true;
    }
    return { user, isNew };
}

export async function closeSessionByRefreshToken(db, conf, refreshToken) {
    const userId = await closeRefreshTokenRepo(db, conf, refreshToken);
    if (!userId) throw new Error('UNAUTHORIZED');
    return userId;
}
