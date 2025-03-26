import { IsString, IsOptional, IsDateString, IsIn, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCompetitionStageDto } from './create-competition-stage.dto';

export class UpdateCompetitionStageDto extends PartialType(CreateCompetitionStageDto) {
  @ApiProperty({ description: '阶段名称', required: false, example: '预选赛' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '阶段描述', required: false, example: '16进8淘汰赛' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '阶段类型', required: false, enum: ['qualification', 'top_16', 'top_8', 'top_4', 'final'], example: 'qualification' })
  @IsString()
  @IsOptional()
  @IsIn(['qualification', 'top_16', 'top_8', 'top_4', 'final'])
  type?: string;

  @ApiProperty({ description: '开始日期', required: false, example: '2023-04-01T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: '结束日期', required: false, example: '2023-04-02T18:00:00Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: '阶段状态', required: false, enum: ['pending', 'in_progress', 'completed'], example: 'pending' })
  @IsString()
  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed'])
  status?: string;

  @ApiProperty({ description: '阶段顺序', required: false, example: 1 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  stageOrder?: number;
}