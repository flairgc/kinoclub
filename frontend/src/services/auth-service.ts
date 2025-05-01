import { api } from "./api";

interface LoginPayload { login: string; password: string; }
interface RegisterPayload { login: string; password: string; email?: string; }

export const loginApi = (payload: LoginPayload) => api.post('/auth/login', payload);
export const logoutApi = () => api.get('/auth/logout');
export const registerApi = (payload: RegisterPayload) => api.post('/auth/register', payload);
export const loginByTelegramApi = (payload: TelegramLoginData) => api.post('/auth/loginByTelegram', payload);

export interface TelegramLoginData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
}

// export async function loginByTelegramApi(
//   data: TelegramLoginData,
// ): Promise<{ message: string; userId: number }> {
//   return request<{ message: string; userId: number }>(`/auth/loginByTelegram`, {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }
