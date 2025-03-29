import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { CreateCompetitionStageDto } from './dto/create-competition-stage.dto';
import { UpdateCompetitionStageDto } from './dto/update-competition-stage.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Competition } from '@prisma/client';

@ApiTags('competitions')
@Controller('api/competitions')
@ApiBearerAuth()
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  @ApiOperation({ summary: '创建比赛' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() createCompetitionDto: CreateCompetitionDto): Promise<Competition> {
    return this.competitionsService.create(createCompetitionDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有比赛' })
  @ApiResponse({ status: 200, description: '成功获取比赛列表' })
  findAll(
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('keyword') keyword?: string,
  ): Promise<{ success: boolean; data: { items: Competition[]; total: number } }> {
  return this.competitionsService.findAll({
    page: current,
    pageSize,
    keyword,
  });
}

  @Get(':id')
  @ApiOperation({ summary: '获取单个比赛详情' })
  @ApiResponse({ status: 200, description: '成功获取比赛详情' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  findOne(@Param('id') id: string): Promise<{ data: Competition; success: boolean }> {
    return this.competitionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新比赛信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  update(
    @Param('id') id: string, 
    @Body() updateCompetitionDto: UpdateCompetitionDto
  ): Promise<{ data: Competition; success: boolean }> {
    return this.competitionsService.update(+id, updateCompetitionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除比赛' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.competitionsService.remove(+id);
  }

  @Get(':id/details')
  @ApiOperation({ summary: '获取比赛详情包括阶段和选手' })
  @ApiResponse({ status: 200, description: '成功获取比赛详细信息' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  findOneWithDetails(@Param('id') id: string): Promise<any> {
    return this.competitionsService.findOneWithDetails(+id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: '获取比赛统计信息' })
  @ApiResponse({ status: 200, description: '成功获取比赛统计数据' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  getCompetitionStats(@Param('id') id: string): Promise<any> {
    return this.competitionsService.getCompetitionStats(+id);
  }

  @Get(':id/stages')
  @ApiOperation({ summary: '获取比赛阶段' })
  @ApiResponse({ status: 200, description: '成功获取比赛阶段' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  async getCompetitionStages(@Param('id') id: string) {
    try {
      const stages = await this.competitionsService.getCompetitionStages(+id);
      return {
        success: true,
        data: stages,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post(':id/stages')
  @ApiOperation({ summary: '创建比赛阶段' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 404, description: '比赛不存在' })
  async createCompetitionStage(
    @Param('id') id: string,
    @Body() createStageDto: CreateCompetitionStageDto,
  ) {
    try {
      const stage = await this.competitionsService.createCompetitionStage(+id, createStageDto);
      return {
        success: true,
        data: stage,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id/stages/:stageId')
  @ApiOperation({ summary: '更新比赛阶段' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '比赛或阶段不存在' })
  async updateCompetitionStage(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
    @Body() updateStageDto: UpdateCompetitionStageDto,
  ) {
    try {
      const stage = await this.competitionsService.updateCompetitionStage(+id, +stageId, updateStageDto);
      return {
        success: true,
        data: stage,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id/stages/:stageId')
  @ApiOperation({ summary: '删除比赛阶段' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '比赛或阶段不存在' })
  async deleteCompetitionStage(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
  ) {
    try {
      await this.competitionsService.deleteCompetitionStage(+id, +stageId);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
} 
