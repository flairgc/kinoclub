const API_BASE = "/api";

interface RegisterData {
  login: string;
  password: string;
  name?: string;
  passwordHint?: string;
  email?: string;
}

interface LoginData {
  login: string;
  password: string;
}

interface User {
  id: number;
  login: string;
  name?: string;
  email?: string;
}

// interface ErrorResponse {
//   error: string;
// }

// type ApiResponse<T> = T | ErrorResponse;

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(API_BASE + url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error((data as any).error || response.statusText);
  }
  return data;
}

// Auth
export async function register(
  data: RegisterData,
): Promise<{ userId: number }> {
  return request<{ userId: number }>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(
  data: LoginData,
): Promise<{ message: string; userId: number }> {
  return request<{ message: string; userId: number }>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface TelegramLoginData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
}

export async function loginByTelegram(
  data: TelegramLoginData,
): Promise<{ message: string; userId: number }> {
  return request<{ message: string; userId: number }>(`/auth/loginByTelegram`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<void> {
  return request(`/auth/logout`, {
    method: "GET",
  });
}

export async function refreshToken(): Promise<{ message: string }> {
  return request<{ message: string }>(`/auth/refreshToken`, {
    method: "GET",
  });
}

// Public
export async function hello(): Promise<{ message: string }> {
  return request<{ message: string }>(`/hello`, {
    method: "GET",
  });
}

// User
export async function getCurrentUser(): Promise<{
  user: { login: string; name?: string };
}> {
  return request<{ user: { login: string; name?: string } }>(`/me`, {
    method: "GET",
  });
}

export async function getUserById(id: number): Promise<User[]> {
  return request<User[]>(`/user/${id}`, {
    method: "GET",
  });
}

export async function getUsers(): Promise<User[]> {
  return request<User[]>(`/users`, {
    method: "GET",
  });
}
