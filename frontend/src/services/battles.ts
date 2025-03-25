import { request } from '@umijs/max';
import type { API } from './typings';

export interface Battle {
  id: number;
  competitionId: number;
  stageId: number;
  competitor1Id: number;
  competitor2Id: number;
  winnerId?: number;
  status: 'pending' | 'in_progress' | 'completed';
  startTime: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  competition?: {
    id: number;
    name: string;
  };
  stage?: {
    id: number;
    name: string;
  };
  competitor1?: {
    id: number;
    name: string;
    englishName?: string;
    city?: string;
    crew?: string;
  };
  competitor2?: {
    id: number;
    name: string;
    englishName?: string;
    city?: string;
    crew?: string;
  };
  winner?: {
    id: number;
    name: string;
  };
}

export interface Score {
  id: number;
  battleId: number;
  competitorId: number;
  judgeId: number;
  technicalScore: number;
  creativeScore: number;
  performanceScore: number;
  musicalityScore: number;
  comment?: string;
  createdAt: string;
  judgeName: string;
  competitorName: string;
}

export interface BattleListParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  competitionId?: number;
  stageId?: number;
}

export interface BattleListResponse {
  data: API.Battle[];
  total: number;
  success: boolean;
}

export interface BattleDetailResponse {
  data: API.Battle;
  success: boolean;
}

export interface BattleScoresResponse {
  data: API.Score[];
  success: boolean;
}

export interface CreateScoreParams {
  competitorId: number;
  technicalScore: number;
  creativeScore: number;
  performanceScore: number;
  musicalityScore: number;
  comment?: string;
}

// 获取对阵列表
export async function getBattlesList(params: BattleListParams) {
  return request<BattleListResponse>('/api/battles', {
    method: 'GET',
    params,
  });
}

// 按比赛ID获取对阵列表
export async function getBattlesByCompetition(competitionId: number, params?: { 
  current?: number; 
  pageSize?: number;
}) {
  return request<{
    data: any[];
    success: boolean;
    total?: number;
  }>(`/api/battles/competition/${competitionId}`, {
    method: 'GET',
    params,
  });
}

// 按阶段ID获取对阵列表
export async function getBattlesByStage(stageId: number, params?: { 
  current?: number; 
  pageSize?: number;
}) {
  return request<{
    data: any[];
    success: boolean;
    total?: number;
  }>(`/api/battles/stage/${stageId}`, {
    method: 'GET',
    params,
  });
}

// 获取对阵详情
export async function getBattleDetail(id: number) {
  return request<BattleDetailResponse>(`/api/battles/${id}`, {
    method: 'GET',
  });
}

// 更新对阵信息
export async function updateBattle(id: number, data: Record<string, any>) {
  return request<{
    data: any;
    success: boolean;
  }>(`/api/battles/${id}`, {
    method: 'PATCH',
    data,
  });
}

// 创建对阵
export async function createBattle(data: Record<string, any>) {
  return request<{
    data: any;
    success: boolean;
  }>('/api/battles', {
    method: 'POST',
    data,
  });
}

// 删除对阵
export async function deleteBattle(id: number) {
  return request<{
    success: boolean;
  }>(`/api/battles/${id}`, {
    method: 'DELETE',
  });
}

export async function getBattleScores(id: number) {
  return request<BattleScoresResponse>(`/api/battles/${id}/scores`, {
    method: 'GET',
  });
}

export async function createScore(battleId: number, data: CreateScoreParams) {
  return request<{ success: boolean }>(`/api/battles/${battleId}/scores`, {
    method: 'POST',
    data,
  });
}

export async function setBattleWinner(battleId: number, competitorId: number) {
  return request<{ success: boolean }>(`/api/battles/${battleId}/winner`, {
    method: 'POST',
    data: { competitorId },
  });
}

export async function updateBattleStatus(battleId: number, status: string) {
  return request<{ success: boolean }>(`/api/battles/${battleId}/status`, {
    method: 'PATCH',
    data: { status },
  });
}