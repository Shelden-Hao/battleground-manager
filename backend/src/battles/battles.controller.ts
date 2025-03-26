import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BattlesService } from './battles.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';
import { Battle } from '@prisma/client';

@ApiTags('battles')
@Controller('api/battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @Post()
  @ApiOperation({ summary: '创建对阵' })
  @ApiResponse({ status: 201, description: '对阵创建成功' })
  @ApiResponse({ status: 400, description: '输入数据验证失败' })
  create(@Body() createBattleDto: CreateBattleDto) {
    return this.battlesService.create(createBattleDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有对阵' })
  @ApiResponse({ status: 200, description: '获取对阵列表成功' })
  findAll() {
    return this.battlesService.findAll();
  }

  @Get('competition/:competitionId')
  @ApiOperation({ summary: '获取指定比赛的所有对阵' })
  @ApiParam({ name: 'competitionId', description: '比赛ID' })
  @ApiResponse({ status: 200, description: '获取对阵列表成功' })
  findByCompetition(@Param('competitionId', ParseIntPipe) competitionId: number) {
    return this.battlesService.findByCompetition(competitionId);
  }

  @Get('stage/:stageId')
  @ApiOperation({ summary: '获取指定比赛阶段的所有对阵' })
  @ApiParam({ name: 'stageId', description: '比赛阶段ID' })
  @ApiResponse({ status: 200, description: '获取对阵列表成功' })
  findByStage(@Param('stageId', ParseIntPipe) stageId: number) {
    return this.battlesService.findByStage(stageId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取对阵详情' })
  @ApiParam({ name: 'id', description: '对阵ID' })
  @ApiResponse({ status: 200, description: '获取对阵详情成功' })
  @ApiResponse({ status: 404, description: '对阵不存在' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.battlesService.findOne(id);
  }

  @Get(':id/scores')
  @ApiOperation({ summary: '获取对阵评分详情' })
  @ApiParam({ name: 'id', description: '对阵ID' })
  @ApiResponse({ status: 200, description: '获取对阵评分详情成功' })
  @ApiResponse({ status: 404, description: '对阵不存在' })
  getBattleScores(@Param('id', ParseIntPipe) id: number) {
    return this.battlesService.getBattleScores(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新对阵信息' })
  @ApiParam({ name: 'id', description: '对阵ID' })
  @ApiResponse({ status: 200, description: '更新对阵成功' })
  @ApiResponse({ status: 400, description: '输入数据验证失败' })
  @ApiResponse({ status: 404, description: '对阵不存在' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBattleDto: UpdateBattleDto) {
    return this.battlesService.update(id, updateBattleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除对阵' })
  @ApiParam({ name: 'id', description: '对阵ID' })
  @ApiResponse({ status: 200, description: '删除对阵成功' })
  @ApiResponse({ status: 404, description: '对阵不存在' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.battlesService.remove(id);
  }
}
