import { request } from '@umijs/max';
import { API } from "@/services/typings.d";

export async function login(params: API.LoginParams): Promise<API.LoginResult> {
  return request('/api/auth/login', {
    method: 'POST',
    data: params,
  });
}

export async function register(params: any) {
  return request('/api/auth/register', {
    method: 'POST',
    data: params,
  });
}

export async function getCurrentUser() {
  return request<API.CurrentUser>('/api/auth/profile', {
    method: 'GET',
  });
}
