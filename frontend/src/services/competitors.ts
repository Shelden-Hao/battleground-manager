import { request } from '@umijs/max';

export interface Competitor {
  id: number;
  name: string;
  englishName?: string;
  gender: 'male' | 'female';
  age: number;
  city: string;
  crew?: string;
  createdAt: string;
  updatedAt: string;
  competitions?: any[];
  wins?: number;
  winRate?: number;
}

export interface CompetitorListParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
}

export interface CompetitorListResponse {
  data: Competitor[];
  total: number;
  success: boolean;
}

export interface CompetitorDetailResponse {
  data: Competitor;
  success: boolean;
}

export async function getCompetitorsList(params: CompetitorListParams) {
  return request<CompetitorListResponse>('/api/competitors', {
    method: 'GET',
    params,
  });
}

export async function getCompetitorDetail(id: number) {
  return request<CompetitorDetailResponse>(`/api/competitors/${id}`, {
    method: 'GET',
  });
}

export async function createCompetitor(data: Partial<Competitor>) {
  return request<CompetitorDetailResponse>('/api/competitors', {
    method: 'POST',
    data,
  });
}

export async function updateCompetitor(id: number, data: Partial<Competitor>) {
  return request<CompetitorDetailResponse>(`/api/competitors/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteCompetitor(id: number) {
  return request<{ success: boolean }>(`/api/competitors/${id}`, {
    method: 'DELETE',
  });
} 