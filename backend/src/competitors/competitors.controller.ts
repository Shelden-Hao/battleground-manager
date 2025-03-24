import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { CompetitorsService } from './competitors.service';
import { CreateCompetitorDto } from './dto/create-competitor.dto';
import { UpdateCompetitorDto } from './dto/update-competitor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Competitor } from '@prisma/client';

@ApiTags('competitors')
@Controller('competitors')
@ApiBearerAuth()
export class CompetitorsController {
  constructor(private readonly competitorsService: CompetitorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiOperation({ summary: '创建选手' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 409, description: '报名编号已存在' })
  create(@Body() createCompetitorDto: CreateCompetitorDto): Promise<Competitor> {
    return this.competitorsService.create(createCompetitorDto);
  }

  @Get()
  @ApiOperation({ summary: '获取选手列表' })
  @ApiResponse({ status: 200, description: '成功获取选手列表' })
  @ApiQuery({ name: 'competitionId', required: false, type: Number, description: '按比赛ID筛选' })
  async findAll(@Query('competitionId') competitionId?: string): Promise<Competitor[]> {
    if (competitionId) {
      return this.competitorsService.findByCompetition(+competitionId);
    }
    return this.competitorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个选手详情' })
  @ApiResponse({ status: 200, description: '成功获取选手详情' })
  @ApiResponse({ status: 404, description: '选手不存在' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Competitor> {
    return this.competitorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiOperation({ summary: '更新选手信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '选手不存在' })
  @ApiResponse({ status: 409, description: '报名编号已存在' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompetitorDto: UpdateCompetitorDto,
  ): Promise<Competitor> {
    return this.competitorsService.update(id, updateCompetitorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '删除选手' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '选手不存在' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Competitor> {
    return this.competitorsService.remove(id);
  }

  @Get(':id/competitions')
  @ApiOperation({ summary: '获取选手参加的比赛' })
  @ApiResponse({ status: 200, description: '成功获取比赛信息' })
  @ApiResponse({ status: 404, description: '选手不存在' })
  getCompetitorCompetitions(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.competitorsService.getCompetitorCompetitions(id);
  }

  @Get(':id/battles')
  @ApiOperation({ summary: '获取选手的对阵记录' })
  @ApiResponse({ status: 200, description: '成功获取对阵记录' })
  @ApiResponse({ status: 404, description: '选手不存在' })
  getCompetitorBattles(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.competitorsService.getCompetitorBattles(id);
  }
} 