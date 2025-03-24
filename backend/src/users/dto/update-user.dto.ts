import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({ description: '密码', example: 'password123', required: false })
  @IsOptional()
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  password?: string;

  @ApiProperty({ description: '角色', enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role, { message: '角色值无效' })
  role?: Role;

  @ApiProperty({ description: '名称', example: '张三', required: false })
  @IsOptional()
  @IsString({ message: '名称必须是字符串' })
  name?: string;

  @ApiProperty({ description: '邮箱', example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiProperty({ description: '手机号', example: '13800138000', required: false })
  @IsOptional()
  @IsString({ message: '手机号必须是字符串' })
  phone?: string;
} 