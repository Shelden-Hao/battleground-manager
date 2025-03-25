import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { Competition } from '@prisma/client';
import { CreateCompetitionStageDto } from './dto/create-competition-stage.dto';
import { UpdateCompetitionStageDto } from './dto/update-competition-stage.dto';

@Injectable()
export class CompetitionsService {
  constructor(private prisma: PrismaService) {}

  // 创建比赛
  async create(createCompetitionDto: CreateCompetitionDto): Promise<Competition> {
    return this.prisma.competition.create({
      data: createCompetitionDto,
    });
  }

  // 获取所有比赛
  async findAll(params: { page?: number; pageSize?: number; keyword?: string }) {
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.max(1, Number(params.pageSize) || 10);
    const skip = (page - 1) * pageSize;
    const { keyword } = params;

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
            { location: { contains: keyword } },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      this.prisma.competition.count({ where }),
      this.prisma.competition.findMany({
        where,
        skip: skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: {
              competitors: true,
              battles: true,
              judges: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        items: data.map(item => ({
          ...item,
          competitorsCount: item._count.competitors,
          battlesCount: item._count.battles,
          judgesCount: item._count.judges,
          _count: undefined
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
    };
  }

  // 获取单个比赛详情
  async findOne(id: number): Promise<{ data: Competition; success: boolean }> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new Error('Competition not found');
    }

    return {
      data: competition,
      success: true,
    };
  }

  // 更新比赛
  async update(id: number, updateCompetitionDto: UpdateCompetitionDto): Promise<{ data: Competition; success: boolean }> {
    const competition = await this.prisma.competition.update({
      where: { id },
      data: updateCompetitionDto,
    });

    return {
      data: competition,
      success: true,
    };
  }

  // 删除比赛
  async remove(id: number): Promise<{ success: boolean }> {
    await this.prisma.competition.delete({
      where: { id },
    });

    return {
      success: true,
    };
  }

  // 获取比赛详情包括阶段和选手
  async findOneWithDetails(id: number): Promise<any> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
      include: {
        stages: {
          orderBy: {
            stageOrder: 'asc',
          },
        },
        competitors: true,
      },
    });

    if (!competition) {
      throw new NotFoundException(`比赛ID为 ${id} 的记录不存在`);
    }

    return competition;
  }

  // 获取比赛统计信息
  async getCompetitionStats(id: number): Promise<any> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            competitors: true,
            battles: true,
            judges: true,
          },
        },
      },
    });

    if (!competition) {
      throw new NotFoundException(`比赛ID为 ${id} 的记录不存在`);
    }

    return {
      id: competition.id,
      name: competition.name,
      status: competition.status,
      startDate: competition.startDate,
      endDate: competition.endDate,
      competitorsCount: competition._count.competitors,
      battlesCount: competition._count.battles,
      judgesCount: competition._count.judges,
    };
  }

  // 获取比赛阶段列表
  async getCompetitionStages(competitionId: number) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      throw new NotFoundException(`比赛ID为 ${competitionId} 的记录不存在`);
    }

    const stages = await this.prisma.competitionStage.findMany({
      where: { competitionId },
      orderBy: { 
        stageOrder: 'asc',
      },
    });

    return stages;
  }

  // 创建比赛阶段
  async createCompetitionStage(competitionId: number, createStageDto: CreateCompetitionStageDto) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      throw new NotFoundException(`比赛ID为 ${competitionId} 的记录不存在`);
    }

    return this.prisma.competitionStage.create({
      data: {
        name: createStageDto.name,
        description: createStageDto.description,
        stageType: createStageDto.type as any,
        stageOrder: createStageDto.stageOrder || 0,
        startTime: createStageDto.startDate ? new Date(createStageDto.startDate) : null,
        endTime: createStageDto.endDate ? new Date(createStageDto.endDate) : null,
        status: createStageDto.status as any,
        competition: {
          connect: { id: competitionId }
        }
      },
    });
  }

  // 更新比赛阶段
  async updateCompetitionStage(
    competitionId: number,
    stageId: number,
    updateStageDto: UpdateCompetitionStageDto,
  ) {
    const stage = await this.prisma.competitionStage.findFirst({
      where: {
        id: stageId,
        competitionId,
      },
    });

    if (!stage) {
      throw new NotFoundException(`阶段ID为 ${stageId} 的记录不存在于比赛 ${competitionId} 中`);
    }

    const updateData: any = {};
    if (updateStageDto.name !== undefined) updateData.name = updateStageDto.name;
    if (updateStageDto.description !== undefined) updateData.description = updateStageDto.description;
    if (updateStageDto.type !== undefined) updateData.stageType = updateStageDto.type as any;
    if (updateStageDto.startDate !== undefined) updateData.startTime = new Date(updateStageDto.startDate);
    if (updateStageDto.endDate !== undefined) updateData.endTime = new Date(updateStageDto.endDate);
    if (updateStageDto.status !== undefined) updateData.status = updateStageDto.status as any;
    if (updateStageDto.stageOrder !== undefined) updateData.stageOrder = updateStageDto.stageOrder;

    return this.prisma.competitionStage.update({
      where: { id: stageId },
      data: updateData,
    });
  }

  // 删除比赛阶段
  async deleteCompetitionStage(competitionId: number, stageId: number) {
    const stage = await this.prisma.competitionStage.findFirst({
      where: {
        id: stageId,
        competitionId,
      },
    });

    if (!stage) {
      throw new NotFoundException(`阶段ID为 ${stageId} 的记录不存在于比赛 ${competitionId} 中`);
    }

    await this.prisma.competitionStage.delete({
      where: { id: stageId },
    });
  }
}