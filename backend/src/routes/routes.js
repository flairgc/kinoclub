import fastifyPlugin from "fastify-plugin";
import { publicRoutes } from "./public/public-routes.js";
import { privateContext } from "./private/private-routes.js";

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  fastify.register(publicRoutes, { prefix: '/api' });
  fastify.register(privateContext, { prefix: '/api' });
}

export default fastifyPlugin(routes);
