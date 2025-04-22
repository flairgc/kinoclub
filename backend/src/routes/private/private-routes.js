import { userRoutes, fetchUsers } from "./user-routes.js";
import { taskRoutes } from "./task-routes.js";

async function privateRoutes(fastify) {
  // Регистрация маршрутов пользователя под префиксом "/user"
  fastify.register(userRoutes, { prefix: "/user" });

  // Эндпойнт получения всех пользователей по /users
  fastify.get("/users", {
    schema: {
      description: 'Get all users with optional pagination',
      tags: ['users'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1 },
          limit: { type: 'integer', minimum: 1 }
        }
      },
      response: {
        200: {
          type: 'array',
          items: { $ref: 'User#' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { page, limit } = request.query;
      let users;
      if (page && limit) {
        const offset = (page - 1) * limit;
        users = await fetchUsers(fastify.pg, limit, offset);
      } else {
        users = await fetchUsers(fastify.pg);
      }
      return users;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { DB_ERROR: error };
    }
  });
}

export async function privateContext(fastify) {
  fastify.addHook("onRequest", async function authenticate(request, reply) {
    const { access } = request.cookies;

    try {
      const transaction = await fastify.pg.query(
          `SELECT user_id FROM fact_sessions
         WHERE access_token=$1 AND created_at + interval '${fastify.conf.access_timeout} minute' > now() AND closed_at is null`,
          [access],
      );

      if (transaction.rows.length !== 1) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      request.user_id = transaction.rows[0].user_id;
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.register(privateRoutes);
}
