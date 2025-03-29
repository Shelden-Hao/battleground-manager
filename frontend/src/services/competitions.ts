import { request } from '@umijs/max';
import type { Competition as CompetitionType, CompetitionStage, Competitor, Battle, Judge, Score, CompetitionResult } from './typings';

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
    items: Competition[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface CompetitionDetailResponse {
  success: boolean;
  data: Competition;
}

export interface CompetitionStagesResponse {
  success: boolean;
  data: CompetitionStage[];
}

export interface CompetitionStageResponse {
  success: boolean;
  data: CompetitionStage;
}

export interface CreateCompetitionParams {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxParticipants: number;
  registrationDeadline?: string;
  status?: 'draft' | 'registration' | 'in_progress' | 'completed';
}

export interface UpdateCompetitionParams extends Partial<CreateCompetitionParams> {}

export interface CreateCompetitionStageParams {
  competitionId: number;
  name: string;
  description?: string;
  stageOrder: number;
  stageType: 'qualification' | 'top_16' | 'top_8' | 'top_4' | 'final';
  startTime?: string;
  endTime?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface UpdateCompetitionStageParams extends Partial<CreateCompetitionStageParams> {
  id: number;
}

export interface CreateCompetitorParams {
  competitionId: number;
  userId?: number;
  registrationNumber?: string;
  bBoyName?: string;
  realName: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: string;
  nationality?: string;
  team?: string;
  photoUrl?: string;
  status?: 'registered' | 'qualified' | 'eliminated';
}

export interface UpdateCompetitorParams extends Partial<CreateCompetitorParams> {
  id: number;
}

export interface CreateBattleParams {
  competitionId: number;
  stageId: number;
  competitor1Id?: number;
  competitor2Id?: number;
  battleOrder: number;
  winnerId?: number;
  status?: 'scheduled' | 'in_progress' | 'completed';
  startTime?: string;
  endTime?: string;
}

export interface UpdateBattleParams extends Partial<CreateBattleParams> {
  id: number;
}

export interface CreateJudgeParams {
  competitionId: number;
  userId: number;
  name: string;
  description?: string;
}

export interface UpdateJudgeParams extends Partial<CreateJudgeParams> {
  id: number;
}

export interface CreateScoreParams {
  battleId: number;
  judgeId: number;
  competitorId: number;
  techniqueScore?: number;
  originalityScore?: number;
  musicalityScore?: number;
  executionScore?: number;
  comments?: string;
}

export interface UpdateScoreParams extends Partial<CreateScoreParams> {
  id: number;
}

export interface CreateCompetitionResultParams {
  competitionId: number;
  competitorId: number;
  finalRank?: number;
}

export interface UpdateCompetitionResultParams extends Partial<CreateCompetitionResultParams> {
  id: number;
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
  return request<Competition>('/api/competitions', {
    method: 'POST',
    data,
  });
}

// 更新比赛
export async function updateCompetition(competitionId: string, data: UpdateCompetitionParams) {
  return request<Competition>(`/api/competitions/${competitionId}`, {
    method: 'PATCH',
    data,
  });
}

// 删除比赛
export async function deleteCompetition(id: number) {
  return request<void>(`/api/competitions/${id}`, {
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
export async function createCompetitionStage(data: CreateCompetitionStageParams) {
  return request<CompetitionStage>(`/api/competitions/${data.competitionId}/stages`, {
    method: 'POST',
    data,
  });
}

// 更新比赛阶段
export async function updateCompetitionStage(data: UpdateCompetitionStageParams) {
  return request<CompetitionStage>(
    `/api/competitions/${data.competitionId}/stages/${data.id}`,
    {
      method: 'PATCH',
      data,
    },
  );
}

// 删除比赛阶段
export async function deleteCompetitionStage(competitionId: number, stageId: number) {
  return request<void>(`/api/competitions/${competitionId}/stages/${stageId}`, {
    method: 'DELETE',
  });
}

export async function getCompetitors(competitionId: number) {
  return request<Competitor[]>(`/api/competitions/${competitionId}/competitors`, {
    method: 'GET',
  });
}

export async function createCompetitor(data: CreateCompetitorParams) {
  return request<Competitor>(`/api/competitions/${data.competitionId}/competitors`, {
    method: 'POST',
    data,
  });
}

export async function updateCompetitor(data: UpdateCompetitorParams) {
  return request<Competitor>(
    `/api/competitions/${data.competitionId}/competitors/${data.id}`,
    {
      method: 'PATCH',
      data,
    },
  );
}

export async function deleteCompetitor(competitionId: number, competitorId: number) {
  return request<void>(`/api/competitions/${competitionId}/competitors/${competitorId}`, {
    method: 'DELETE',
  });
}

export async function getBattles(competitionId: number, stageId: number) {
  return request<Battle[]>(`/api/competitions/${competitionId}/stages/${stageId}/battles`, {
    method: 'GET',
  });
}

export async function createBattle(data: CreateBattleParams) {
  return request<Battle>(
    `/api/competitions/${data.competitionId}/stages/${data.stageId}/battles`,
    {
      method: 'POST',
      data,
    },
  );
}

export async function updateBattle(data: UpdateBattleParams) {
  return request<Battle>(
    `/api/competitions/${data.competitionId}/stages/${data.stageId}/battles/${data.id}`,
    {
      method: 'PATCH',
      data,
    },
  );
}

export async function deleteBattle(competitionId: number, stageId: number, battleId: number) {
  return request<void>(
    `/api/competitions/${competitionId}/stages/${stageId}/battles/${battleId}`,
    {
      method: 'DELETE',
    },
  );
}

export async function getJudges(competitionId: number) {
  return request<Judge[]>(`/api/competitions/${competitionId}/judges`, {
    method: 'GET',
  });
}

export async function createJudge(data: CreateJudgeParams) {
  return request<Judge>(`/api/competitions/${data.competitionId}/judges`, {
    method: 'POST',
    data,
  });
}

export async function updateJudge(data: UpdateJudgeParams) {
  return request<Judge>(`/api/competitions/${data.competitionId}/judges/${data.id}`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteJudge(competitionId: number, judgeId: number) {
  return request<void>(`/api/competitions/${competitionId}/judges/${judgeId}`, {
    method: 'DELETE',
  });
}

export async function getScores(battleId: number) {
  return request<Score[]>(`/api/battles/${battleId}/scores`, {
    method: 'GET',
  });
}

export async function createScore(data: CreateScoreParams) {
  return request<Score>(`/api/battles/${data.battleId}/scores`, {
    method: 'POST',
    data,
  });
}

export async function updateScore(data: UpdateScoreParams) {
  return request<Score>(`/api/battles/${data.battleId}/scores/${data.id}`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteScore(battleId: number, scoreId: number) {
  return request<void>(`/api/battles/${battleId}/scores/${scoreId}`, {
    method: 'DELETE',
  });
}

export async function getCompetitionResults(competitionId: number) {
  return request<CompetitionResult[]>(`/api/competitions/${competitionId}/results`, {
    method: 'GET',
  });
}

export async function createCompetitionResult(data: CreateCompetitionResultParams) {
  return request<CompetitionResult>(`/api/competitions/${data.competitionId}/results`, {
    method: 'POST',
    data,
  });
}

export async function updateCompetitionResult(data: UpdateCompetitionResultParams) {
  return request<CompetitionResult>(
    `/api/competitions/${data.competitionId}/results/${data.id}`,
    {
      method: 'PATCH',
      data,
    },
  );
}

export async function deleteCompetitionResult(competitionId: number, resultId: number) {
  return request<void>(`/api/competitions/${competitionId}/results/${resultId}`, {
    method: 'DELETE',
  });
}
