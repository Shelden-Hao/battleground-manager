export namespace API {
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

  export interface CompetitionStage {
    id: number;
    competitionId: number;
    name: string;
    description?: string;
    stageType: string;
    stageOrder: number;
    startTime: string;
    endTime: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface CompetitionStats {
    totalParticipants: number;
    totalStages: number;
    totalBattles: number;
    completedBattles: number;
    inProgressBattles: number;
    pendingBattles: number;
  }
} 