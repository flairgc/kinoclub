function getConfig() {
  return {
    port: Number(process.env.APP_PORT),
    db_connection: process.env.APP_DB_CONNECTION_STRING,
    access_timeout: Number(process.env.APP_ACCESS_TIMEOUT_MIN),
    refresh_timeout: Number(process.env.APP_REFRESH_TIMEOUT_MIN),
    tg_bot_token: process.env.APP_TELEGRAM_BOT_TOKEN,
    supabaseUrl: process.env.APP_SUPABASE_PROJECT_URL,
    supabaseBucket: process.env.APP_SUPABASE_BUCKET_NAME,
    supabaseApiKey: process.env.APP_SUPABASE_SECRET_API_KEY,
  }
}

export const config = getConfig();
