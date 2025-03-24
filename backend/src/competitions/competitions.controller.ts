import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Competition } from '@prisma/client';

@ApiTags('competitions')
@Controller('competitions')
@ApiBearerAuth()
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '创建比赛' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() createCompetitionDto: CreateCompetitionDto): Promise<Competition> {
    return this.competitionsService.create(createCompetitionDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有比赛' })
  @ApiResponse({ status: 200, description: '成功获取比赛列表' })
  findAll(): Promise<Competition[]> {
    return this.competitionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个比赛详情' })
  @ApiResponse({ status: 200, description: '成功获取比赛详情' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Competition> {
    return this.competitionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '更新比赛信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ): Promise<Competition> {
    return this.competitionsService.update(id, updateCompetitionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '删除比赛' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Competition> {
    return this.competitionsService.remove(id);
  }

  @Get(':id/details')
  @ApiOperation({ summary: '获取比赛详情包括阶段和选手' })
  @ApiResponse({ status: 200, description: '成功获取比赛详细信息' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  findOneWithDetails(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.competitionsService.findOneWithDetails(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: '获取比赛统计信息' })
  @ApiResponse({ status: 200, description: '成功获取比赛统计数据' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  getCompetitionStats(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.competitionsService.getCompetitionStats(id);
  }
} 