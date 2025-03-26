declare namespace API {
  type CurrentUser = {
    id: number;
    username: string;
    role: 'admin' | 'judge' | 'competitor' | 'staff';
    name?: string;
    email?: string;
    phone?: string;
  };

  type LoginParams = {
    username: string;
    password: string;
  };

  type LoginResult = {
    access_token: string;
    user: CurrentUser;
  };

  type RegisterParams = {

  }

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type Competition = {
    id: number;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
    status: 'draft' | 'registration' | 'in_progress' | 'completed';
    createdAt: string;
    updatedAt: string;
  };

  type Competitor = {
    id: number;
    userId?: number;
    competitionId: number;
    registrationNumber?: string;
    bBoyName?: string;
    realName: string;
    gender: 'male' | 'female' | 'other';
    birthDate?: string;
    nationality?: string;
    team?: string;
    photoUrl?: string;
    status: 'registered' | 'qualified' | 'eliminated';
    createdAt: string;
    updatedAt: string;
  };

  type Battle = {
    id: number;
    competitionId: number;
    stageId: number;
    competitor1Id?: number;
    competitor2Id?: number;
    battleOrder: number;
    winnerId?: number;
    status: 'scheduled' | 'in_progress' | 'completed';
    startTime?: string;
    endTime?: string;
    createdAt: string;
    updatedAt: string;
    competitor1?: Competitor;
    competitor2?: Competitor;
    winner?: Competitor;
    stage?: CompetitionStage;
  };

  type CompetitionStage = {
    id: number;
    competitionId: number;
    name: string;
    description?: string;
    stageOrder: number;
    stageType: 'qualification' | 'top_16' | 'top_8' | 'top_4' | 'final';
    startTime?: string;
    endTime?: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: string;
    updatedAt: string;
  };

  type Score = {
    id: number;
    battleId: number;
    judgeId: number;
    competitorId: number;
    techniqueScore?: number;
    originalityScore?: number;
    musicalityScore?: number;
    executionScore?: number;
    totalScore?: number;
    comments?: string;
    createdAt: string;
    updatedAt: string;
  };

  type CompetitionResult = {
    id: number;
    competitionId: number;
    competitorId: number;
    finalRank?: number;
    createdAt: string;
    updatedAt: string;
    competitor?: Competitor;
  };

  type ErrorResponse = {
    statusCode: number;
    message: string;
    error?: string;
  };
}
