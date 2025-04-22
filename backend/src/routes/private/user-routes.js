async function fetchUserById(pg, id) {
    const { rows } = await pg.query(
        "SELECT id, login, email, name FROM dict_users WHERE id=$1",
        [id]
    );
    return rows[0];
}

export async function fetchUsers(pg, limit, offset) {
    if (limit != null && offset != null) {
        const { rows } = await pg.query(
            "SELECT id, login, email, name FROM dict_users ORDER BY id LIMIT $1 OFFSET $2",
            [limit, offset]
        );
        return rows;
    }
    const { rows } = await pg.query(
        "SELECT id, login, email, name FROM dict_users ORDER BY id"
    );
    return rows;
}

export async function userRoutes(fastify) {
    // Получить информацию текущего пользователя
    fastify.get('/', {
        schema: {
            description: 'Get current authenticated user info',
            tags: ['users'],
            response: {
                200: { $ref: 'User#' }
            }
        }
    }, async (request, reply) => {
        try {
            const user = await fetchUserById(fastify.pg, request.user_id);
            return user;
        } catch (error) {
            fastify.log.error(error);
            reply.code(500);
            return { DB_ERROR: error };
        }
    });

    // Получить пользователя по id из параметров
    fastify.get('/:id', {
        schema: {
            description: 'Get user by ID',
            tags: ['users'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer' }
                },
                required: ['id']
            },
            response: {
                200: { $ref: 'User#' }
            }
        }
    }, async (request, reply) => {
        try {
            const userId = Number(request.params.id);
            const user = await fetchUserById(fastify.pg, userId);
            return user;
        } catch (error) {
            fastify.log.error(error);
            reply.code(500);
            return { DB_ERROR: error };
        }
    });
}
