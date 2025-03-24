import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitorDto } from './dto/create-competitor.dto';
import { UpdateCompetitorDto } from './dto/update-competitor.dto';
import { Competitor } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CompetitorsService {
  constructor(private prisma: PrismaService) {}

  // 创建选手
  async create(createCompetitorDto: CreateCompetitorDto): Promise<Competitor> {
    try {
      return await this.prisma.competitor.create({
        data: createCompetitorDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('报名编号已存在');
        }
      }
      throw error;
    }
  }

  // 获取所有选手
  async findAll(): Promise<Competitor[]> {
    return this.prisma.competitor.findMany({
      include: {
        competition: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  // 按比赛ID获取选手
  async findByCompetition(competitionId: number): Promise<Competitor[]> {
    return this.prisma.competitor.findMany({
      where: {
        competitionId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
  }

  // 获取单个选手详情
  async findOne(id: number): Promise<Competitor> {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id },
      include: {
        competition: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!competitor) {
      throw new NotFoundException(`选手ID为 ${id} 的记录不存在`);
    }

    return competitor;
  }

  // 更新选手
  async update(id: number, updateCompetitorDto: UpdateCompetitorDto): Promise<Competitor> {
    try {
      return await this.prisma.competitor.update({
        where: { id },
        data: updateCompetitorDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`选手ID为 ${id} 的记录不存在`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('报名编号已存在');
        }
      }
      throw error;
    }
  }

  // 删除选手
  async remove(id: number): Promise<Competitor> {
    try {
      return await this.prisma.competitor.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`选手ID为 ${id} 的记录不存在`);
        }
      }
      throw error;
    }
  }

  // 获取选手参加的比赛
  async getCompetitorCompetitions(id: number): Promise<any> {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id },
      include: {
        competition: true,
      },
    });

    if (!competitor) {
      throw new NotFoundException(`选手ID为 ${id} 的记录不存在`);
    }

    return competitor.competition;
  }

  // 获取选手的对阵记录
  async getCompetitorBattles(id: number): Promise<any> {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id },
    });

    if (!competitor) {
      throw new NotFoundException(`选手ID为 ${id} 的记录不存在`);
    }

    const battles = await this.prisma.battle.findMany({
      where: {
        OR: [
          { competitor1Id: id },
          { competitor2Id: id },
        ],
      },
      include: {
        competition: {
          select: {
            name: true,
          },
        },
        stage: {
          select: {
            name: true,
            stageType: true,
          },
        },
        competitor1: {
          select: {
            id: true,
            bBoyName: true,
            realName: true,
          },
        },
        competitor2: {
          select: {
            id: true,
            bBoyName: true,
            realName: true,
          },
        },
        winner: {
          select: {
            id: true,
            bBoyName: true,
            realName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return battles;
  }
} 