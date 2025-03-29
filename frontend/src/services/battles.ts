import { request } from 'umi';
import { API } from "./typings.d";

export interface BattleListParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  competitionId?: number;
  stageId?: number;
}

export interface BattleListResponse {
  success: boolean;
  data: API.Battle[];
  total: number;
}

export interface BattleResponse {
  success: boolean;
  data: API.Battle;
}

export interface BattleScoresResponse {
  success: boolean;
  data: API.Score[];
}

export interface CreateScoreParams {
  competitorId: number;
  techniqueScore: number;
  creativeScore: number;
  performanceScore: number;
  musicalityScore: number;
  comment?: string;
}

// 获取对战列表
export async function getBattlesList(params?: BattleListParams) {
  return request<BattleListResponse>('/api/battles', {
    method: 'GET',
    params,
  });
}

// 获取对战详情
export async function getBattle(id: number) {
  return request<BattleResponse>(`/api/battles/${id}`, {
    method: 'GET',
  });
}

// 获取对战详情 (别名，用于兼容)
export async function getBattleDetail(id: number) {
  return getBattle(id);
}

// 创建对战
export async function createBattle(data: API.Battle) {
  return request<BattleResponse>('/api/battles', {
    method: 'POST',
    data,
  });
}

// 更新对战
export async function updateBattle(data: Partial<API.Battle> & { id: number }) {
  const { id, ...updateData } = data;
  return request<BattleResponse>(`/api/battles/${id}`, {
    method: 'PATCH',
    data: updateData,
  });
}

// 删除对战
export async function deleteBattle(id: number) {
  return request<{success: boolean}>(`/api/battles/${id}`, {
    method: 'DELETE',
  });
}

// 获取对战评分
export async function getBattleScores(id: number) {
  return request<BattleScoresResponse>(`/api/battles/${id}/scores`, {
    method: 'GET',
  });
}

// 创建评分
export async function createScore(data: CreateScoreParams & { battleId: number }) {
  return request<{success: boolean}>(`/api/battles/${data.battleId}/scores`, {
    method: 'POST',
    data,
  });
}

// 设置对战胜者
export async function setBattleWinner(battleId: number, competitorId: number) {
  return request<{success: boolean}>(`/api/battles/${battleId}/winner`, {
    method: 'POST',
    data: { competitorId },
  });
}

// 更新对战状态
export async function updateBattleStatus(battleId: number, status: string) {
  return request<{success: boolean}>(`/api/battles/${battleId}/status`, {
    method: 'PATCH',
    data: { status },
  });
}

// 获取指定比赛的所有对阵
export async function getBattlesByCompetitionId(competitionId: number) {
  return request<BattleListResponse>(`/api/battles/competition/${competitionId}`, {
    method: 'GET',
  });
}

// 获取指定比赛阶段的所有对阵
export async function getBattlesByStageId(stageId: number) {
  return request<BattleListResponse>(`/api/battles/competition/${stageId}`, {
    method: 'GET',
  });
}
