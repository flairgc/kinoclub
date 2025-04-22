import crypto from "crypto";
import { createSession } from "../../utils/auth.js";
import { verifyTelegramAuth } from './utils.js';


const createSessionAndReply = async (fastify, request, reply, userId, sendData) => {
  const { access, refresh } = await createSession(fastify, {
    userId: userId,
    userAgent: request.headers["user-agent"],
    userIP: request.ip,
  });

  return (
      reply
          .setCookie("access", access, {
            path: "/",
            httpOnly: true,
          })
          .setCookie("refresh", refresh, {
            path: "/",
            httpOnly: true,
          })
          .send(sendData)
  );
}

export async function authRoutes(fastify) {
  fastify.post("/register", async (request, reply) => {
    const { login, password, name, passwordHint } = request.body;

    if (!login || !password) {
      return reply
        .status(400)
        .send({ error: "Username and password are required" });
    }

    try {
      const salt = crypto.randomBytes(16).toString("hex");
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");

      const { rows } = await fastify.pg.query(
        "INSERT INTO dict_users (login, pass, salt, name, password_hint) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [login, hashedPassword, salt, name, passwordHint],
      );

      const userId = rows[0].id;

      return await createSessionAndReply(fastify, request, reply, { message: "Registration successful", userId: userId })
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: "Internal Server Error", error_details: err });
    }
  });

  fastify.post("/login", async (request, reply) => {
    const { login, password } = request.body;

    // validation
    if (
      typeof login !== "string" ||
      typeof password !== "string" ||
      !login ||
      !password
    ) {
      return reply.code(400).send({ error: "There is no login or password" });
    }

    try {
      const db = await fastify.pg.query(
        "SELECT id, login, pass, salt FROM dict_users WHERE login=$1",
        [login],
      );

      if (db.rows.length !== 1) {
        return reply.code(401).send({ error: "Invalid username or password" });
      }
      const user = db.rows[0];
      const hashedPassword = crypto
        .pbkdf2Sync(password, user.salt, 1000, 64, "sha512")
        .toString("hex");

      if (hashedPassword !== user.pass) {
        return reply
          .status(400)
          .send({ error: "Invalid username or password" });
      }

      return await createSessionAndReply(fastify, request, reply, user.id, { message: "Login successful", userId: user.id })
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: "Internal Server Error", error_details: err  });
    }
  });

  fastify.get("/logout", async (request, reply) => {
    const { access } = request.cookies;

    try {
      const transaction = await fastify.pg.query(
          `SELECT user_id FROM fact_sessions
         WHERE access_token=$1 AND created_at + interval '${fastify.conf.access_timeout} minute' > now() AND closed_at is null`,
          [access],
      );

      if (transaction.rows.length !== 1) {
        return reply.code(401).send({ error: "Session does not exists" });
      }

      await fastify.pg.query(
          `UPDATE fact_sessions SET closed_at = now() WHERE access_token=$1`,
          [access],
      );

      reply.send({ message: "Logout successful" })
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.get("/refreshToken", async (request, reply) => {
    const { refresh } = request.cookies;

    try {
      const transaction = await fastify.pg.query(
        `DELETE FROM fact_sessions 
         WHERE refresh_token=$1
           AND created_at + interval '${fastify.conf.refresh_timeout} minute' > now()
         RETURNING user_id`,
        [refresh],
      );

      if (transaction.rows.length === 0) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const user = transaction.rows[0];

      const { access: newAccess, refresh: newRefresh } = await createSession(
        fastify,
        {
          userId: user.user_id,
          userAgent: request.headers["user-agent"],
          userIP: request.ip,
        },
      );

      return (
        reply
          .setCookie("access", newAccess, {
            path: "/",
            httpOnly: true,
          })
          .setCookie("refresh", newRefresh, {
            path: "/",
            httpOnly: true,
          })
          // TODO body is debugging information, then remove it
          .send({ message: "Refresh token updated" })
      );
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: "Internal Server Error", error_details: err  });
    }
  });


  fastify.post("/loginByTelegram", async (request, reply) => {
    const {
      id: telegramId,
      username,
      first_name,
      last_name,
      photo_url,
    } = request.body;

    const { tg_bot_token } = fastify.conf;

    const hashIsValid = verifyTelegramAuth(request.body, tg_bot_token);

    // 1. проверить, валидность хеша
    if (!hashIsValid) {
      return reply.status(400).send({ message: "Hash is invalid" });
    }

    try {
      // 2. найти пользователя по этому id телеги, если есть то логин, если нет то нужно создать
      const user = await fastify.pg.query(
          `SELECT id FROM dict_users WHERE telegram_id=$1`,
          [telegramId],
      );

      if (user.rows.length === 1) {
        // 3. логин - просто такой же логин как и обычно, создаем сессию
        const userId = user.rows[0].id;
        return await createSessionAndReply(fastify, request, reply, userId, { message: "Login by TG successful", userId })
      } else {
        // 4. если нужна регистрация и юзернейм нету, то тогда генерим его случайно, имя сшиваем Имя + Фамилия

        const newLogin = username || `user${(await fastify.pg.query(
            `SELECT MAX(id) as id FROM dict_users`,
        )).rows[0].id + 1}`;



        const newName = `${first_name}${last_name ? ' ' + last_name : ''}`;

        const newUserDB = await fastify.pg.query(
            "INSERT INTO dict_users (login, name, telegram_id) VALUES ($1, $2, $3) RETURNING id",
            [newLogin, newName, telegramId],
        );
        const userId = newUserDB.rows[0].id;
        return await createSessionAndReply(fastify, request, reply, userId, { message: "Registration successful", userId })
      }


    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: "Internal Server Error", error_details: err });
    }
  });
}
