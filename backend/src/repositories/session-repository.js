export async function saveSessionRepo(db, { userId, userAgent, userIP, access, refresh }) {
    return await db.query(
        `INSERT INTO fact_sessions (user_id, access_token, refresh_token, device, user_ip)
        VALUES ($1, $2, $3, $4, $5)`,
        [userId, access, refresh, userAgent, userIP],
    );
}

export async function getOpenSessionByAccessTokenRepo(db, conf, accessToken) {
    const { rows } = await db.query(
        `SELECT
           user_id,
           refresh_token,
           created_at,
           device,
           user_ip
        FROM fact_sessions
         WHERE access_token=$1
         AND created_at + make_interval(mins => $2) > now()
           AND closed_at IS NULL`,
        [accessToken, conf.refresh_timeout]
    );
    return rows[0];
}

export async function closeSessionRepo(db, accessToken) {
    await db.query(
        `UPDATE fact_sessions
         SET closed_at = now()
         WHERE access_token=$1`,
        [accessToken]
    );
}

export async function closeRefreshTokenRepo(db, conf, refreshToken) {
    const { rows } = await db.query(
        `UPDATE fact_sessions
         SET closed_at = now()         
         WHERE refresh_token=$1
         AND created_at + make_interval(mins => $2) > now()
         RETURNING user_id`,
        [refreshToken, conf.refresh_timeout]
    );
    return rows.length ? rows[0].user_id : null;
}
