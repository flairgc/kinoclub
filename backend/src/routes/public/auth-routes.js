import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  loginByTelegramController,
} from '../../controllers/auth-controller.js';

export async function authRoutes(fastify) {
  fastify.post('/register', registerController);
  fastify.post('/login', loginController);
  fastify.get('/logout', logoutController);
  fastify.get('/refreshToken', refreshTokenController);
  fastify.post('/loginByTelegram', loginByTelegramController);
}

