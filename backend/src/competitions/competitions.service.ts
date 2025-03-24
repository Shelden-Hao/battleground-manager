import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { Competition } from '@prisma/client';

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
  async findAll(): Promise<Competition[]> {
    return this.prisma.competition.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  // 获取单个比赛详情
  async findOne(id: number): Promise<Competition> {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException(`比赛ID为 ${id} 的记录不存在`);
    }

    return competition;
  }

  // 更新比赛
  async update(id: number, updateCompetitionDto: UpdateCompetitionDto): Promise<Competition> {
    try {
      return await this.prisma.competition.update({
        where: { id },
        data: updateCompetitionDto,
      });
    } catch (error) {
      throw new NotFoundException(`比赛ID为 ${id} 的记录不存在`);
    }
  }

  // 删除比赛
  async remove(id: number): Promise<Competition> {
    try {
      return await this.prisma.competition.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`比赛ID为 ${id} 的记录不存在`);
    }
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
} 