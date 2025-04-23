import { checkAuthHook } from '../hooks/checkAuthHook.js';
import { userRoutes } from "./user-routes.js";

async function privateRoutes(fastify) {
  // Регистрация маршрутов пользователя под префиксом "/user"
  fastify.register(userRoutes);
}

export async function privateContext(fastify) {
  fastify.addHook("onRequest", checkAuthHook);
  fastify.register(privateRoutes);
}
