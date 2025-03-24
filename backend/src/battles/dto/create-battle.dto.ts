import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { BattleStatus } from '@prisma/client';

export class CreateBattleDto {
  @ApiProperty({ description: '比赛ID' })
  @IsInt()
  competitionId: number;

  @ApiProperty({ description: '比赛阶段ID' })
  @IsInt()
  stageId: number;

  @ApiProperty({ description: '选手1 ID', required: false })
  @IsInt()
  @IsOptional()
  competitor1Id?: number;

  @ApiProperty({ description: '选手2 ID', required: false })
  @IsInt()
  @IsOptional()
  competitor2Id?: number;

  @ApiProperty({ description: '对阵顺序（用于排序）' })
  @IsInt()
  battleOrder: number;

  @ApiProperty({ description: '获胜者 ID', required: false })
  @IsInt()
  @IsOptional()
  winnerId?: number;

  @ApiProperty({ 
    description: '对阵状态', 
    enum: BattleStatus,
    default: BattleStatus.scheduled,
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