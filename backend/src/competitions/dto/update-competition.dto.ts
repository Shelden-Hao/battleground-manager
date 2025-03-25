import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { CompetitionStatus } from '@prisma/client';
import { CreateCompetitionDto } from './create-competition.dto';
import { Type } from 'class-transformer';

export class UpdateCompetitionDto extends PartialType(CreateCompetitionDto) {
  @ApiProperty({ description: '比赛名称', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '比赛描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

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