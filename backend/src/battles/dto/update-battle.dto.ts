import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { BattleStatus } from '@prisma/client';

export class UpdateBattleDto {
  @ApiProperty({ description: '比赛ID', required: false })
  @IsInt()
  @IsOptional()
  competitionId?: number;

  @ApiProperty({ description: '比赛阶段ID', required: false })
  @IsInt()
  @IsOptional()
  stageId?: number;

  @ApiProperty({ description: '选手1 ID', required: false })
  @IsInt()
  @IsOptional()
  competitor1Id?: number;

  @ApiProperty({ description: '选手2 ID', required: false })
  @IsInt()
  @IsOptional()
  competitor2Id?: number;

  @ApiProperty({ description: '对阵顺序（用于排序）', required: false })
  @IsInt()
  @IsOptional()
  battleOrder?: number;

  @ApiProperty({ description: '获胜者 ID', required: false })
  @IsInt()
  @IsOptional()
  winnerId?: number;

  @ApiProperty({ 
    description: '对阵状态', 
    enum: BattleStatus,
    required: false
  })
  @IsEnum(BattleStatus)
  @IsOptional()
  status?: BattleStatus;

  @ApiProperty({ description: '开始时间', required: false })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({ description: '结束时间', required: false })
  @IsDateString()
  @IsOptional()
  endTime?: string;
} 