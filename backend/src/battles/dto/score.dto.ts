import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateScoreDto {
  @ApiProperty({ description: '对阵ID' })
  @IsInt()
  battleId: number;

  @ApiProperty({ description: '评委ID' })
  @IsInt()
  judgeId: number;

  @ApiProperty({ description: '选手ID' })
  @IsInt()
  competitorId: number;

  @ApiProperty({ description: '技术得分', minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  techniqueScore: number;

  @ApiProperty({ description: '原创性得分', minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  originalityScore: number;

  @ApiProperty({ description: '音乐性得分', minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  musicalityScore: number;

  @ApiProperty({ description: '表现力得分', minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  executionScore: number;

  @ApiProperty({ description: '评价备注', required: false })
  @IsOptional()
  @IsString()
  comments?: string;
}

export class UpdateScoreDto {
  @ApiProperty({ description: '技术得分', minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  techniqueScore?: number;

  @ApiProperty({ description: '原创性得分', minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  originalityScore?: number;

  @ApiProperty({ description: '音乐性得分', minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  musicalityScore?: number;

  @ApiProperty({ description: '表现力得分', minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  executionScore?: number;

  @ApiProperty({ description: '评价备注', required: false })
  @IsOptional()
  @IsString()
  comments?: string;
}

export class ScoreResponseDto {
  @ApiProperty({ description: '评分ID' })
  id: number;

  @ApiProperty({ description: '对阵ID' })
  battleId: number;

  @ApiProperty({ description: '评委ID' })
  judgeId: number;

  @ApiProperty({ description: '选手ID' })
  competitorId: number;

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

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
} 