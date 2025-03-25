import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
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
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: '结束日期 (YYYY-MM-DD)' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: '比赛地点', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: '最大参与者数量', required: false })
  @IsNumber()
  @Min(1)
  maxParticipants: number;

  @ApiProperty({ description: '注册截止日期 (YYYY-MM-DD)', required: false })
  @Type(() => Date)
  @IsDate()
  registrationDeadline: Date;

  @ApiProperty({ 
    description: '比赛状态', 
    enum: CompetitionStatus,
    default: CompetitionStatus.draft 
  })
  @IsEnum(CompetitionStatus)
  @IsOptional()
  status?: CompetitionStatus;
} 