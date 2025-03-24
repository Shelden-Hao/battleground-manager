import { request } from '@umijs/max';
import type { API } from '@/services/typings';

// 获取对阵列表
export async function getBattlesList(params?: { 
  current?: number;
  pageSize?: number;
  keyword?: string;
}) {
  return request<{
    data: any[];
    success: boolean;
    total?: number;
  }>('/api/battles', {
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
  return request<{
    data: any;
    success: boolean;
  }>(`/api/battles/${id}`, {
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

// 获取对阵评分
export async function getBattleScores(battleId: number) {
  return request<{
    data: {
      scores: Array<{
        competitor: any;
        judgeScores: Array<{
          judge: { id: number; name: string };
          techniqueScore: number;
          originalityScore: number;
          musicalityScore: number;
          executionScore: number;
          comments?: string;
        }>;
        averages: {
          technique: number;
          originality: number;
          musicality: number;
          execution: number;
          total: number;
        };
      }>;
    };
    success: boolean;
  }>(`/api/battles/${battleId}/scores`, {
    method: 'GET',
  });
}

// 创建/提交评分
export async function createScore(data: {
  battleId: number;
  competitorId: number;
  judgeId: number;
  techniqueScore: number;
  originalityScore: number;
  musicalityScore: number;
  executionScore: number;
  comments?: string;
}) {
  return request<{
    data: any;
    success: boolean;
  }>('/api/scores', {
    method: 'POST',
    data,
  });
}

// 更新评分
export async function updateScore(id: number, data: Partial<{
  techniqueScore: number;
  originalityScore: number;
  musicalityScore: number;
  executionScore: number;
  comments?: string;
}>) {
  return request<{
    data: any;
    success: boolean;
  }>(`/api/scores/${id}`, {
    method: 'PATCH',
    data,
  });
}

// 删除评分
export async function deleteScore(id: number) {
  return request<{
    success: boolean;
  }>(`/api/scores/${id}`, {
    method: 'DELETE',
  });
}

// 评分相关API
export async function getScoresList() {
  return request<API.Score[]>('/api/scores', {
    method: 'GET',
  });
}

export async function getScoresByBattle(battleId: number) {
  return request<API.Score[]>(`/api/scores/battle/${battleId}`, {
    method: 'GET',
  });
}

export async function getScoresByBattleAndCompetitor(battleId: number, competitorId: number) {
  return request<API.Score[]>(`/api/scores/battle/${battleId}/competitor/${competitorId}`, {
    method: 'GET',
  });
}

export async function getCompetitorTotalScore(battleId: number, competitorId: number) {
  return request<any>(`/api/scores/battle/${battleId}/competitor/${competitorId}/total`, {
    method: 'GET',
  });
} 