import { api } from "./api";

export const fetchCurrentUserApi = () => api.get('/me');
export const fetchAllUsersApi = () => api.get('/users');
