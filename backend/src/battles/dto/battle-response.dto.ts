import { ApiProperty } from '@nestjs/swagger';
import { BattleStatus } from '@prisma/client';

export class CompetitorBriefDto {
  @ApiProperty({ description: '选手ID' })
  id: number;

  @ApiProperty({ description: 'B-Boy/B-Girl名称' })
  bBoyName: string;

  @ApiProperty({ description: '真实姓名' })
  realName: string;
}

export class StageBriefDto {
  @ApiProperty({ description: '比赛阶段名称' })
  name: string;

  @ApiProperty({ description: '比赛阶段类型' })
  stageType: string;
}

export class CompetitionBriefDto {
  @ApiProperty({ description: '比赛名称' })
  name: string;
}

export class JudgeBriefDto {
  @ApiProperty({ description: '评委ID' })
  id: number;

  @ApiProperty({ description: '评委姓名' })
  name: string;

  @ApiProperty({ description: '评委用户名' })
  username: string;
}

export class ScoreBriefDto {
  @ApiProperty({ description: '评委信息' })
  judge: JudgeBriefDto;

  @ApiProperty({ description: '技术得分' })
  techniqueScore: number;

  @ApiProperty({ description: '原创性得分' })
  originalityScore: number;

  @ApiProperty({ description: '音乐性得分' })
  musicalityScore: number;

  @ApiProperty({ description: '表现力得分' })
  executionScore: number;

  @ApiProperty({ description: '评价备注' })
  comments: string;
}

export class CompetitorScoresDto {
  @ApiProperty({ description: '选手信息' })
  competitor: CompetitorBriefDto;

  @ApiProperty({ description: '各评委打分', type: [ScoreBriefDto] })
  judgeScores: ScoreBriefDto[];

  @ApiProperty({ description: '平均分统计' })
  averages: {
    technique: number;
    originality: number;
    musicality: number;
    execution: number;
    total: number;
  };
}

export class BattleScoresResponseDto {
  @ApiProperty({ description: '对阵基本信息' })
  battle: BattleResponseDto;

  @ApiProperty({ description: '选手评分信息', type: [CompetitorScoresDto] })
  scores: CompetitorScoresDto[];
}

export class BattleResponseDto {
  @ApiProperty({ description: '对阵ID' })
  id: number;

  @ApiProperty({ description: '比赛ID' })
  competitionId: number;

  @ApiProperty({ description: '比赛信息' })
  competition?: CompetitionBriefDto;

  @ApiProperty({ description: '比赛阶段ID' })
  stageId: number;

  @ApiProperty({ description: '比赛阶段信息' })
  stage?: StageBriefDto;

  @ApiProperty({ description: '选手1 ID' })
  competitor1Id: number;

  @ApiProperty({ description: '选手1信息' })
  competitor1?: CompetitorBriefDto;

  @ApiProperty({ description: '选手2 ID' })
  competitor2Id: number;

  @ApiProperty({ description: '选手2信息' })
  competitor2?: CompetitorBriefDto;

  @ApiProperty({ description: '对阵顺序' })
  battleOrder: number;

  @ApiProperty({ description: '获胜者ID' })
  winnerId: number;

  @ApiProperty({ description: '获胜者信息' })
  winner?: CompetitorBriefDto;

  @ApiProperty({ description: '对阵状态', enum: BattleStatus })
  status: BattleStatus;

  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
} 