import fastifyPlugin from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";

/**
 * @param {FastifyInstance} fastify
 */
async function dbConnector(fastify) {
  fastify.register(fastifyPostgres, {
    connectionString: fastify.conf.db_connection,
  });
  // test connection
  fastify.after(async (err) => {
    if (err) {
      fastify.log.error(err);
      return;
    }
    try {
      await fastify.pg.query("SELECT 1");
      fastify.log.info("Connection to DB is successful");
    } catch (err) {
      console.error("Connection to DB failed", err);
      fastify.log.error("Connection to DB failed", err);
    }
  });
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
export default fastifyPlugin(dbConnector);
