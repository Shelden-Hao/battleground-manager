import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';
import { Battle, BattleStatus } from '@prisma/client';

@Injectable()
export class BattlesService {
  constructor(private prisma: PrismaService) {}

  // 创建对阵
  async create(createBattleDto: CreateBattleDto): Promise<Battle> {
    try {
      // 检查选手是否属于同一比赛
      if (createBattleDto.competitor1Id && createBattleDto.competitor2Id) {
        const competitor1 = await this.prisma.competitor.findUnique({
          where: { id: createBattleDto.competitor1Id },
        });

        const competitor2 = await this.prisma.competitor.findUnique({
          where: { id: createBattleDto.competitor2Id },
        });

        if (!competitor1 || !competitor2) {
          throw new NotFoundException('选手不存在');
        }

        if (competitor1.competitionId !== createBattleDto.competitionId ||
            competitor2.competitionId !== createBattleDto.competitionId) {
          throw new BadRequestException('选手必须属于同一个比赛');
        }
      }

      // 检查比赛阶段是否存在
      const stage = await this.prisma.competitionStage.findUnique({
        where: { id: createBattleDto.stageId },
      });

      if (!stage) {
        throw new NotFoundException('比赛阶段不存在');
      }

      if (stage.competitionId !== createBattleDto.competitionId) {
        throw new BadRequestException('比赛阶段必须属于指定的比赛');
      }

      return this.prisma.battle.create({
        data: createBattleDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('创建对阵失败: ' + error.message);
    }
  }

  // 获取所有对阵
  async findAll(): Promise<Battle[]> {
    return this.prisma.battle.findMany({
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
      orderBy: [
        { competitionId: 'asc' },
        { stageId: 'asc' },
        { battleOrder: 'asc' },
      ],
    });
  }

  // 按比赛ID获取对阵
  async findByCompetition(competitionId: number): Promise<Battle[]> {
    return this.prisma.battle.findMany({
      where: {
        competitionId,
      },
      include: {
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
      orderBy: [
        { stageId: 'asc' },
        { battleOrder: 'asc' },
      ],
    });
  }

  // 按阶段ID获取对阵
  async findByStage(stageId: number): Promise<Battle[]> {
    return this.prisma.battle.findMany({
      where: {
        stageId,
      },
      include: {
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
        battleOrder: 'asc',
      },
    });
  }

  // 获取单个对阵详情
  async findOne(id: number): Promise<Battle> {
    const battle = await this.prisma.battle.findUnique({
      where: { id },
      include: {
        competition: true,
        stage: true,
        competitor1: true,
        competitor2: true,
        winner: true,
        scores: {
          include: {
            judge: true,
            competitor: true,
          },
        },
      },
    });

    if (!battle) {
      throw new NotFoundException(`对阵ID为 ${id} 的记录不存在`);
    }

    return battle;
  }

  // 更新对阵
  async update(id: number, updateBattleDto: UpdateBattleDto): Promise<Battle> {
    try {
      const battle = await this.prisma.battle.findUnique({
        where: { id },
      });

      if (!battle) {
        throw new NotFoundException(`对阵ID为 ${id} 的记录不存在`);
      }

      // 如果设置了获胜者，自动将状态更新为已完成
      if (updateBattleDto.winnerId && !updateBattleDto.status) {
        updateBattleDto.status = BattleStatus.completed;
      }

      return await this.prisma.battle.update({
        where: { id },
        data: updateBattleDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('更新对阵失败: ' + error.message);
    }
  }

  // 删除对阵
  async remove(id: number): Promise<Battle> {
    try {
      const battle = await this.prisma.battle.findUnique({
        where: { id },
      });

      if (!battle) {
        throw new NotFoundException(`对阵ID为 ${id} 的记录不存在`);
      }

      return await this.prisma.battle.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('删除对阵失败: ' + error.message);
    }
  }

  // 获取对阵的评分
  async getBattleScores(id: number): Promise<any> {
    const battle = await this.prisma.battle.findUnique({
      where: { id },
    });

    if (!battle) {
      throw new NotFoundException(`对阵ID为 ${id} 的记录不存在`);
    }

    const scores = await this.prisma.score.findMany({
      where: {
        battleId: id,
      },
      include: {
        judge: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        competitor: {
          select: {
            id: true,
            bBoyName: true,
            realName: true,
          },
        },
      },
    });

    // 按选手分组计算平均分
    const competitorScores = {};
    scores.forEach(score => {
      const compId = score.competitorId;
      if (!competitorScores[compId]) {
        competitorScores[compId] = {
          competitor: score.competitor,
          judgeScores: [],
          averages: {
            technique: 0,
            originality: 0,
            musicality: 0,
            execution: 0,
            total: 0,
          },
        };
      }

      competitorScores[compId].judgeScores.push({
        judge: score.judge,
        techniqueScore: score.techniqueScore,
        originalityScore: score.originalityScore,
        musicalityScore: score.musicalityScore,
        executionScore: score.executionScore,
        comments: score.comments,
      });
    });

    // 计算平均分
    Object.keys(competitorScores).forEach(compId => {
      const scores = competitorScores[compId].judgeScores;
      if (scores.length > 0) {
        let techniqueSum = 0, originalitySum = 0, musicalitySum = 0, executionSum = 0, count = 0;

        scores.forEach(score => {
          if (score.techniqueScore && score.originalityScore &&
              score.musicalityScore && score.executionScore) {
            techniqueSum += Number(score.techniqueScore);
            originalitySum += Number(score.originalityScore);
            musicalitySum += Number(score.musicalityScore);
            executionSum += Number(score.executionScore);
            count++;
          }
        });

        if (count > 0) {
          competitorScores[compId].averages = {
            technique: parseFloat((techniqueSum / count).toFixed(2)),
            originality: parseFloat((originalitySum / count).toFixed(2)),
            musicality: parseFloat((musicalitySum / count).toFixed(2)),
            execution: parseFloat((executionSum / count).toFixed(2)),
            total: parseFloat(((techniqueSum + originalitySum + musicalitySum + executionSum) / (count * 4)).toFixed(2)),
          };
        }
      }
    });

    return {
      battle,
      scores: Object.values(competitorScores),
    };
  }
}
