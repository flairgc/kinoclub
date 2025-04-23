import { fetchUsersRepo, getUserByIdRepo } from '../repositories/user-repository.js';


export async function currentUsersController(request, reply) {
    try {
        const user = await getUserByIdRepo(request.server.pg, request.user_id);
        return { user };
    } catch (error) {
        request.server.log.error(error);
        reply.code(500);
        return { DB_ERROR: error };
    }
}

export async function userController(request, reply) {
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

export async function allUsersController(request, reply) {
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
