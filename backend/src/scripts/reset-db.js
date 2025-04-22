import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import pg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

dotenv.config()

async function migrateUp() {
    const client = new Client({ connectionString: process.env.APP_DB_CONNECTION_STRING })
    await client.connect()

    const folder = path.join(__dirname, '..', 'sql-pg');
    const files = fs.readdirSync(folder)
        .filter(f => f.endsWith('.sql'))
        .sort()

    for (const file of files) {
        const sql = fs.readFileSync(path.join(folder, file), 'utf8')
        console.info(`→ applying ${file}`)
        await client.query(sql)
        console.info('...success.');
    }

    await client.end()
}

migrateUp().catch(err => {
    console.error(err)
    process.exit(1)
})
