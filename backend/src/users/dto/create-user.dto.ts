import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  username: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  password: string;

  @ApiProperty({ description: '角色', enum: Role, default: Role.competitor })
  @IsOptional()
  @IsEnum(Role, { message: '角色值无效' })
  role?: Role;

  @ApiProperty({ description: '名称', example: '张三' })
  @IsOptional()
  @IsString({ message: '名称必须是字符串' })
  name?: string;

  @ApiProperty({ description: '邮箱', example: 'john@example.com' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsOptional()
  @IsString({ message: '手机号必须是字符串' })
  phone?: string;
} 