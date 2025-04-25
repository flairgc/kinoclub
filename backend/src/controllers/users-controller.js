import { v4 as uuidv4 } from 'uuid';
import { getUserAvatarLinkRepo, uploadUserAvatarRepo } from '../repositories/supabase-repository.js';
import { fetchUsersRepo, getUserByIdRepo, updateUserAvatarRepo } from '../repositories/user-repository.js';
import { saveUserAvatar } from '../services/user-service.js';


export async function getCurrentUsersController(request, reply) {
    try {
        const user = await getUserByIdRepo(request.server.pg, request.userId);
        return { user };
    } catch (error) {
        request.server.log.error(error);
        reply.code(500);
        return { DB_ERROR: error };
    }
}

export async function getUserController(request, reply) {
    try {
        const userId = Number(request.params.id);
        const user = await getUserByIdRepo(request.server.pg, userId);
        return user;
    } catch (error) {
        request.server.log.error(error);
        reply.code(500);
        return { DB_ERROR: error };
    }
}

export async function getAllUsersController(request, reply) {
    try {
        const { page, limit } = request.query;
        let users;
        if (page && limit) {
            const offset = (page - 1) * limit;
            users = await fetchUsersRepo(request.server.pg, limit, offset);
        } else {
            users = await fetchUsersRepo(request.server.pg);
        }
        return users;
    } catch (error) {
        request.server.log.error(error);
        reply.code(500);
        return { DB_ERROR: error };
    }
}

export async function uploadUserAvatarController(request, reply) {
    try {
        const data = await request.file();
        const mimetype = data.mimetype;
        const buffer = await data.toBuffer();

        const avatarUrl = await saveUserAvatar({
            db: request.server.pg,
            supabase: request.server.supabase,
            bucket: request.server.conf.supabaseBucket,
            buffer,
            mimetype,
            userId: request.userId,
        });

        return reply.send({ url: avatarUrl });
    } catch (error) {
        request.server.log.error(error);
        reply.code(500);
        return { error: error };
    }
}
