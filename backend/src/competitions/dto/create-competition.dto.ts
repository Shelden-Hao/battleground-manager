import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { CompetitionStatus } from '@prisma/client';

export class CreateCompetitionDto {
  @ApiProperty({ description: '比赛名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '比赛描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '开始日期 (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: '结束日期 (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: '比赛地点', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ 
    description: '比赛状态', 
    enum: CompetitionStatus,
    default: CompetitionStatus.draft 
  })
  @IsEnum(CompetitionStatus)
  @IsOptional()
  status?: CompetitionStatus;
} 