import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { CompetitionStatus } from '@prisma/client';

export class UpdateCompetitionDto {
  @ApiProperty({ description: '比赛名称', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '比赛描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '开始日期 (YYYY-MM-DD)', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: '结束日期 (YYYY-MM-DD)', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: '比赛地点', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ 
    description: '比赛状态', 
    enum: CompetitionStatus,
    required: false
  })
  @IsEnum(CompetitionStatus)
  @IsOptional()
  status?: CompetitionStatus;
} 