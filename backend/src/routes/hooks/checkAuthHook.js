import { getOpenSessionByAccessTokenRepo } from '../../repositories/session-repository.js';

export async function checkAuthHook(request, reply) {
    const { access } = request.cookies;

    try {

        const session = await getOpenSessionByAccessTokenRepo(request.server.pg, request.server.conf, access);

        if (!session) {
            return reply.code(401).send({ error: "Unauthorized" });
        }

        request.userId = session.user_id;
    } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}
