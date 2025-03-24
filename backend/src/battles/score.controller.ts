import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ScoreService } from './score.service';
import { CreateScoreDto, UpdateScoreDto } from './dto/score.dto';

@ApiTags('scores')
@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  @ApiOperation({ summary: '创建或更新评分' })
  @ApiResponse({ status: 201, description: '评分创建成功' })
  @ApiResponse({ status: 400, description: '输入数据验证失败' })
  create(@Body() createScoreDto: CreateScoreDto) {
    return this.scoreService.create(createScoreDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有评分' })
  @ApiResponse({ status: 200, description: '获取评分列表成功' })
  findAll() {
    return this.scoreService.findAll();
  }

  @Get('battle/:battleId')
  @ApiOperation({ summary: '获取指定对阵的所有评分' })
  @ApiParam({ name: 'battleId', description: '对阵ID' })
  @ApiResponse({ status: 200, description: '获取评分列表成功' })
  @ApiResponse({ status: 404, description: '对阵不存在' })
  findByBattle(@Param('battleId', ParseIntPipe) battleId: number) {
    return this.scoreService.findByBattle(battleId);
  }

  @Get('battle/:battleId/competitor/:competitorId')
  @ApiOperation({ summary: '获取选手在对阵中的所有评分' })
  @ApiParam({ name: 'battleId', description: '对阵ID' })
  @ApiParam({ name: 'competitorId', description: '选手ID' })
  @ApiResponse({ status: 200, description: '获取评分列表成功' })
  @ApiResponse({ status: 404, description: '对阵或选手不存在' })
  findByBattleAndCompetitor(
    @Param('battleId', ParseIntPipe) battleId: number,
    @Param('competitorId', ParseIntPipe) competitorId: number,
  ) {
    return this.scoreService.findByBattleAndCompetitor(battleId, competitorId);
  }

  @Get('battle/:battleId/judge/:judgeId/competitor/:competitorId')
  @ApiOperation({ summary: '获取评委给选手在对阵中的评分' })
  @ApiParam({ name: 'battleId', description: '对阵ID' })
  @ApiParam({ name: 'judgeId', description: '评委ID' })
  @ApiParam({ name: 'competitorId', description: '选手ID' })
  @ApiResponse({ status: 200, description: '获取评分成功' })
  @ApiResponse({ status: 404, description: '评分不存在' })
  findOne(
    @Param('battleId', ParseIntPipe) battleId: number,
    @Param('judgeId', ParseIntPipe) judgeId: number,
    @Param('competitorId', ParseIntPipe) competitorId: number,
  ) {
    return this.scoreService.findOne(battleId, judgeId, competitorId);
  }

  @Get('battle/:battleId/competitor/:competitorId/total')
  @ApiOperation({ summary: '计算选手在对阵中的总分' })
  @ApiParam({ name: 'battleId', description: '对阵ID' })
  @ApiParam({ name: 'competitorId', description: '选手ID' })
  @ApiResponse({ status: 200, description: '计算总分成功' })
  @ApiResponse({ status: 404, description: '对阵或选手不存在' })
  calculateCompetitorTotalScore(
    @Param('battleId', ParseIntPipe) battleId: number,
    @Param('competitorId', ParseIntPipe) competitorId: number,
  ) {
    return this.scoreService.calculateCompetitorTotalScore(battleId, competitorId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新评分' })
  @ApiParam({ name: 'id', description: '评分ID' })
  @ApiResponse({ status: 200, description: '更新评分成功' })
  @ApiResponse({ status: 400, description: '输入数据验证失败' })
  @ApiResponse({ status: 404, description: '评分不存在' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateScoreDto: UpdateScoreDto) {
    return this.scoreService.update(id, updateScoreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评分' })
  @ApiParam({ name: 'id', description: '评分ID' })
  @ApiResponse({ status: 200, description: '删除评分成功' })
  @ApiResponse({ status: 404, description: '评分不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.scoreService.remove(id);
  }
} 