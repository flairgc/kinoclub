import "dotenv/config";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";

import dbConnector from "./db-connector.js";
import routes from "./routes/routes.js";
import { config } from "./utils/config.js";
import { schemas } from "./schemas/common.js"; // импортируем все схемы

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
  logger: true,
});

fastify.decorate('conf', config);

// Регистрируем плагины
fastify.register(fastifyCookie);
fastify.register(dbConnector);

// Регистрируем все схемы до инициализации роутов
schemas.forEach((schema) => fastify.addSchema(schema));

// Регистрируем маршруты
fastify.register(routes);

fastify.listen({ port: config.port }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

fastify.ready(err => {
  if (err) throw err;
  // В консоль выведется дерево всех маршрутов
  console.info('printRoutes', fastify.printRoutes());
});
