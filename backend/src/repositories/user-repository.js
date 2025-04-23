export async function addUserRep(db, { login, pass, salt, name, passwordHint, email }) {
    const { rows } = await db.query(
        `INSERT INTO dict_users (login, pass, salt, name, password_hint, email)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [login, pass, salt, name, passwordHint, email]
    );
    return rows[0];
}

export async function getUserByLoginRepo(db, login) {
    const { rows } = await db.query(
        `SELECT id, login, pass, salt FROM dict_users WHERE login=$1`,
        [login]
    );
    return rows[0];
}

export async function getUserByIdRepo(db, id) {
    const { rows } = await db.query(
        "SELECT id, login, email, name FROM dict_users WHERE id=$1",
        [id]
    );
    return rows[0];
}

export async function fetchUsersRepo(db, limit, offset) {
    if (limit != null && offset != null) {
        const { rows } = await db.query(
            "SELECT id, login, email, name FROM dict_users ORDER BY id LIMIT $1 OFFSET $2",
            [limit, offset]
        );
        return rows;
    }
    const { rows } = await db.query(
        "SELECT id, login, email, name FROM dict_users ORDER BY id"
    );
    return rows;
}

export async function findByTelegramIdRepo(db, telegramId) {
    const { rows } = await db.query(
        `SELECT id FROM dict_users WHERE telegram_id=$1`,
        [telegramId]
    );
    return rows[0];
}

export async function insertTelegramUserPero(db, { login, name, telegramId }) {
    const { rows } = await db.query(
        `INSERT INTO dict_users (login, name, telegram_id)
     VALUES ($1,$2,$3) RETURNING id`,
        [login, name, telegramId]
    );
    return rows[0];
}

export async function getMaxIdRepo(db) {
    const { rows } = await db.query(`SELECT MAX(id) as max FROM dict_users`);
    return rows[0].max;
}
