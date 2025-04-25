import fastifyPlugin from "fastify-plugin";
import { createClient } from '@supabase/supabase-js';

const supabasePlugin = async (fastify) => {
  const { supabaseUrl, supabaseApiKey } = fastify.conf;

  if (!supabaseUrl || !supabaseApiKey) {
    fastify.log.error('SUPABASE_URL или SUPABASE_KEY не заданы');
    throw new Error('Supabase URL and Key are required');
  }

  const supabase = createClient(supabaseUrl, supabaseApiKey);

  fastify.decorate('supabase', supabase);

  fastify.log.info('Supabase клиент подключен');
};

// Оборачиваем плагин с fastify-plugin, чтобы обеспечить совместимость
export default fastifyPlugin(supabasePlugin, {
  name: 'fastify-supabase',
  dependencies: []
});

