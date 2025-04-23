import { allUsersController, currentUsersController, userController } from '../../controllers/users-controller.js';


export async function userRoutes(fastify) {
    // Получить информацию текущего пользователя
    fastify.get('/me', {
        schema: {
            description: 'Get current authenticated user info',
            response: {
                200: {
                    type: 'object',
                    properties: {
                        user: { $ref: 'User#' }
                    },
                    required: ['user']
                }
            }
        }
    }, currentUsersController);
    // Эндпойнт получения всех пользователей по /users
    fastify.get("/users", {
        schema: {
            description: 'Get all users with optional pagination',
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
    }, allUsersController);
    // Получить пользователя по id из параметров
    fastify.get('/user/:id', {
        schema: {
            description: 'Get user by ID',
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
    }, userController);
}
