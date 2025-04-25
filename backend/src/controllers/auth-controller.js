import {
    closeSessionByRefreshToken,
    createSession,
    createUser,
    getUserByTelegramAuth,
    logoutUser,
    verifyLoginUser
} from '../services/auth-service.js';
import { saveUserAvatar } from '../services/user-service.js';


function bindAuthCookieController(reply, { access, refresh }) {
    reply
        .setCookie("access", access, {
            path: "/",
            httpOnly: true,
        })
        .setCookie("refresh", refresh, {
            path: "/",
            httpOnly: true,
        })
}

async function createSessionForUserController(request, reply, userId, message ) {

    const { access, refresh } = await createSession(request.server.pg, {
        userId: userId,
        userAgent: request.headers["user-agent"],
        userIP: request.ip,
    });
    bindAuthCookieController(reply, { access, refresh });

    reply.send({
        message,
        userId,
    });
}

export async function registerController(request, reply) {
    const { login, password, name, passwordHint, email } = request.body;
    if (!login || !password) {
        return reply.status(400).send({ error: 'Username and password are required' });
    }
    try {
        const userId = await createUser(request.server.pg, { login, password, name, passwordHint, email });

        await createSessionForUserController(request, reply, userId, 'Registration successful');
    } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({ error: 'Internal Server Error', error_details: err });
    }
}

export async function loginController(request, reply) {
    const { login, password } = request.body;
    if (typeof login !== 'string' || typeof password !== 'string' || !login || !password) {
        return reply.code(400).send({ error: 'There is no login or password' });
    }
    try {
        const userId = await verifyLoginUser(request.server.pg, login, password);

        await createSessionForUserController(request, reply, userId, 'Login successful');
    } catch (err) {
        if (err.message === 'INVALID_CREDENTIALS') {
            return reply.code(401).send({ error: 'Invalid username or password' });
        }
        request.server.log.error(err);
        return reply.status(500).send({ error: 'Internal Server Error', error_details: err });
    }
}

export async function logoutController(request, reply) {
    try {
        await logoutUser(request.server.pg, request.server.conf, request.cookies.access);
        return reply.send({ message: 'Logout successful' });
    } catch (err) {
        if (err.message === 'SESSION_NOT_FOUND') {
            return reply.code(401).send({ error: 'Session does not exist' });
        }
        request.server.log.error(err);
        return reply.status(500).send({ error: 'Internal Server Error', error_details: err });
    }
}

export async function loginByTelegramController(request, reply) {
    const tg = request.body;
    const photoUrl = tg.photo_url;
    try {
        const { user, isNew } = await getUserByTelegramAuth(request.server.pg, request.server.conf.tg_bot_token, tg);

        // save avatar
        if (isNew && photoUrl) {
            const res = await fetch(photoUrl);
            if (!res.ok) {
                reply.code(400);
                return { error: `Не удалось скачать аватар: ${res.status} ${res.statusText}` };
            }
            const contentType = res.headers.get('content-type') || 'application/octet-stream';
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await saveUserAvatar({
                db: request.server.pg,
                supabase: request.server.supabase,
                bucket: request.server.conf.supabaseBucket,
                buffer,
                mimetype: contentType,
                userId: user.id,
            });
        }

        await createSessionForUserController(request, reply, user.id, 'Login successful');
    } catch (err) {
        if (err.message === 'INVALID_HASH') {
            return reply.status(400).send({ message: 'Telegram login error' });
        }
        request.server.log.error(err);
        return reply.status(500).send({ error: 'Internal Server Error', error_details: err });
    }
}

export async function refreshTokenController(request, reply) {
    try {
        const userId = await closeSessionByRefreshToken(request.server.pg, request.server.conf, request.cookies.refresh);
        await createSessionForUserController(request, reply, userId, 'Refresh token updated');
    } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
            return reply.code(401).send({ error: 'Unauthorized' });
        }
        request.server.log.error(err);
        return reply.status(500).send({ error: 'Internal Server Error', error_details: err });
    }
}
