import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsInt, IsNumber } from 'class-validator';
import { CompetitorStatus, Gender } from '@prisma/client';

export class CreateCompetitorDto {
  @ApiProperty({ description: '用户ID (可选，关联用户账号)', required: false })
  @IsInt()
  @IsOptional()
  userId?: number;

  @ApiProperty({ description: '比赛ID' })
  @IsInt()
  competitionId: number;

  @ApiProperty({ description: '报名编号', required: false })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiProperty({ description: 'B-boy/B-girl 艺名', required: false })
  @IsString()
  @IsOptional()
  bBoyName?: string;

  @ApiProperty({ description: '真实姓名' })
  @IsString()
  realName: string;

  @ApiProperty({ 
    description: '性别', 
    enum: Gender,
    example: Gender.male
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: '出生日期 (YYYY-MM-DD)', required: false })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiProperty({ description: '国籍', required: false })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({ description: '所属团队/俱乐部', required: false })
  @IsString()
  @IsOptional()
  team?: string;

  @ApiProperty({ description: '照片URL', required: false })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ 
    description: '状态', 
    enum: CompetitorStatus,
    default: CompetitorStatus.registered,
    required: false
  })
  @IsEnum(CompetitorStatus)
  @IsOptional()
  status?: CompetitorStatus;
} 