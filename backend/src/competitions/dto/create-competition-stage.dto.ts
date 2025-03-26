import { IsString, IsNotEmpty, IsOptional, IsDateString, IsIn, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompetitionStageDto {
  @ApiProperty({ description: '阶段名称', example: '预选赛' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '阶段描述', required: false, example: '16进8淘汰赛' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '阶段类型', enum: ['qualification', 'top_16', 'top_8', 'top_4', 'final'], example: 'qualification' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['qualification', 'top_16', 'top_8', 'top_4', 'final'])
  type: string;

  @ApiProperty({ description: '开始日期', example: '2023-04-01T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: '结束日期', example: '2023-04-02T18:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: '阶段状态', enum: ['pending', 'in_progress', 'completed'], example: 'pending' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'in_progress', 'completed'])
  status: string;

  @ApiProperty({ description: '阶段顺序', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  stageOrder?: number;
}