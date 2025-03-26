export interface User {
  id: number;
  username: string;
  role: 'admin' | 'judge' | 'competitor' | 'staff';
  name?: string;
  email?: string;
  phone?: string;
}

export interface Competition {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxParticipants: number;
  registrationDeadline?: string;
  status: 'draft' | 'registration' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Competitor {
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
}

export interface CompetitionStage {
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
}

export interface Battle {
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
}

export interface Judge {
  id: number;
  userId: number;
  competitionId: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Score {
  id: number;
  battleId: number;
  judgeId: number;
  competitorId: number;
  techniqueScore?: number;
  originalityScore?: number;
  musicalityScore?: number;
  executionScore?: number;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionResult {
  id: number;
  competitionId: number;
  competitorId: number;
  finalRank?: number;
  createdAt: string;
  updatedAt: string;
}
