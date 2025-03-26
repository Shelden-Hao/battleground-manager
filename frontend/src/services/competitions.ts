import { request } from '@umijs/max';
import type { API } from './typings';

export interface Competition {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxParticipants: number;
  registrationDeadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface CompetitionListResponse {
  success: boolean;
  data: {
    items: API.Competition[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface CompetitionDetailResponse {
  success: boolean;
  data: API.Competition;
}

export interface CompetitionStagesResponse {
  success: boolean;
  data: API.CompetitionStage[];
}

export interface CompetitionStageResponse {
  success: boolean;
  data: API.CompetitionStage;
}

export interface CreateCompetitionParams {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  registrationStartDate: string;
  registrationDeadline: string;
  status: string;
}

export interface UpdateCompetitionParams extends CreateCompetitionParams {}

export interface CreateCompetitionStageParams {
  name: string;
  description?: string;
  type: string; // qualification, top_16, top_8, top_4, final
  startDate: string;
  endDate: string;
  status: string; // pending, in_progress, completed
  stageOrder?: number;
}

export interface UpdateCompetitionStageParams {
  name?: string;
  description?: string;
  type?: string; // qualification, top_16, top_8, top_4, final
  startDate?: string;
  endDate?: string;
  status?: string; // pending, in_progress, completed
  stageOrder?: number;
}

// 获取比赛列表
export async function getCompetitionsList(params: CompetitionListParams) {
  return request<CompetitionListResponse>('/api/competitions', {
    method: 'GET',
    params,
  });
}

// 获取比赛详情
export async function getCompetitionDetail(id: number) {
  return request<CompetitionDetailResponse>(`/api/competitions/${id}`, {
    method: 'GET',
  });
}

// 创建比赛
export async function createCompetition(data: CreateCompetitionParams) {
  return request<CompetitionDetailResponse>('/api/competitions', {
    method: 'POST',
    data,
  });
}

// 更新比赛
export async function updateCompetition(id: number, data: UpdateCompetitionParams) {
  return request<CompetitionDetailResponse>(`/api/competitions/${id}`, {
    method: 'PATCH',
    data,
  });
}

// 删除比赛
export async function deleteCompetition(id: number) {
  return request<{ success: boolean }>(`/api/competitions/${id}`, {
    method: 'DELETE',
  });
}

// 获取比赛阶段列表
export async function getCompetitionStages(competitionId: number) {
  return request<CompetitionStagesResponse>(`/api/competitions/${competitionId}/stages`, {
    method: 'GET',
  });
}

// 创建比赛阶段
export async function createCompetitionStage(competitionId: number, data: CreateCompetitionStageParams) {
  return request<CompetitionStageResponse>(`/api/competitions/${competitionId}/stages`, {
    method: 'POST',
    data,
  });
}

// 更新比赛阶段
export async function updateCompetitionStage(competitionId: number, stageId: number, data: UpdateCompetitionStageParams) {
  return request<CompetitionStageResponse>(`/api/competitions/${competitionId}/stages/${stageId}`, {
    method: 'PATCH',
    data,
  });
}

// 删除比赛阶段
export async function deleteCompetitionStage(competitionId: number, stageId: number) {
  return request<{ success: boolean }>(`/api/competitions/${competitionId}/stages/${stageId}`, {
    method: 'DELETE',
  });
}

export async function getCompetitionDetails(id: number) {
  return request<{ data: any; success: boolean }>(`/api/competitions/${id}/details`, {
    method: 'GET',
  });
}

export async function getCompetitionStats(id: number) {
  return request<{ data: any; success: boolean }>(`/api/competitions/${id}/stats`, {
    method: 'GET',
  });
} 