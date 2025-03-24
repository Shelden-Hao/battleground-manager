import {Controller, Post, Body, UseGuards, Request, Get} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './guards/local-auth.guard';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth} from '@nestjs/swagger';
import {CreateUserDto} from '../users/dto/create-user.dto';
import {LoginDto} from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({summary: '用户登录'})
    @ApiBody({type: LoginDto})
    @ApiResponse({status: 200, description: '登录成功'})
    @ApiResponse({status: 401, description: '登录失败'})
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    @ApiOperation({summary: '用户注册'})
    @ApiBody({type: CreateUserDto})
    @ApiResponse({status: 201, description: '注册成功'})
    @ApiResponse({status: 400, description: '注册失败'})
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({summary: '获取用户信息'})
    @ApiResponse({status: 200, description: '获取成功'})
    @ApiResponse({status: 401, description: '未授权'})
    getProfile(@Request() req) {
        return req.user;
    }
}
