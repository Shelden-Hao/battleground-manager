import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScoreDto, UpdateScoreDto } from './dto/score.dto';
import { Score } from '@prisma/client';

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}

  // 创建评分
  async create(createScoreDto: CreateScoreDto): Promise<Score> {
    try {
      // 检查对阵是否存在
      const battle = await this.prisma.battle.findUnique({
        where: { id: createScoreDto.battleId },
      });
      
      if (!battle) {
        throw new NotFoundException(`对阵ID为 ${createScoreDto.battleId} 的记录不存在`);
      }
      
      // 检查评委是否存在
      const judge = await this.prisma.judge.findUnique({
        where: { id: createScoreDto.judgeId },
      });
      
      if (!judge) {
        throw new NotFoundException(`评委ID为 ${createScoreDto.judgeId} 的记录不存在`);
      }
      
      // 检查选手是否存在，以及是否是本场对阵的选手
      const competitor = await this.prisma.competitor.findUnique({
        where: { id: createScoreDto.competitorId },
      });
      
      if (!competitor) {
        throw new NotFoundException(`选手ID为 ${createScoreDto.competitorId} 的记录不存在`);
      }
      
      // 检查选手是否是本场对阵的选手
      if (battle.competitor1Id !== createScoreDto.competitorId && 
          battle.competitor2Id !== createScoreDto.competitorId) {
        throw new BadRequestException('该选手不是本场对阵的参赛选手');
      }
      
      // 检查是否已存在该评委对该选手在该对阵的评分
      const existingScore = await this.prisma.score.findFirst({
        where: {
          battleId: createScoreDto.battleId,
          judgeId: createScoreDto.judgeId,
          competitorId: createScoreDto.competitorId,
        },
      });
      
      if (existingScore) {
        // 如果已存在，更新评分
        return this.prisma.score.update({
          where: { id: existingScore.id },
          data: {
            techniqueScore: createScoreDto.techniqueScore,
            originalityScore: createScoreDto.originalityScore,
            musicalityScore: createScoreDto.musicalityScore,
            executionScore: createScoreDto.executionScore,
            comments: createScoreDto.comments,
          },
        });
      }
      
      // 创建新评分
      return this.prisma.score.create({
        data: createScoreDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('创建评分失败: ' + error.message);
    }
  }

  // 获取所有评分
  async findAll(): Promise<Score[]> {
    return this.prisma.score.findMany({
      include: {
        battle: {
          select: {
            competitionId: true,
            stageId: true,
          },
        },
        judge: {
          select: {
            name: true,
          },
        },
        competitor: {
          select: {
            bBoyName: true,
            realName: true,
          },
        },
      },
    });
  }

  // 获取对阵的所有评分
  async findByBattle(battleId: number): Promise<Score[]> {
    const battle = await this.prisma.battle.findUnique({
      where: { id: battleId },
    });
    
    if (!battle) {
      throw new NotFoundException(`对阵ID为 ${battleId} 的记录不存在`);
    }
    
    return this.prisma.score.findMany({
      where: {
        battleId,
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
  }

  // 获取选手在对阵中的所有评分
  async findByBattleAndCompetitor(battleId: number, competitorId: number): Promise<Score[]> {
    const battle = await this.prisma.battle.findUnique({
      where: { id: battleId },
    });
    
    if (!battle) {
      throw new NotFoundException(`对阵ID为 ${battleId} 的记录不存在`);
    }
    
    const competitor = await this.prisma.competitor.findUnique({
      where: { id: competitorId },
    });
    
    if (!competitor) {
      throw new NotFoundException(`选手ID为 ${competitorId} 的记录不存在`);
    }
    
    return this.prisma.score.findMany({
      where: {
        battleId,
        competitorId,
      },
      include: {
        judge: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // 获取评委为选手在对阵中的评分
  async findOne(battleId: number, judgeId: number, competitorId: number): Promise<Score> {
    const score = await this.prisma.score.findFirst({
      where: {
        battleId,
        judgeId,
        competitorId,
      },
    });
    
    if (!score) {
      throw new NotFoundException(`未找到对应的评分记录`);
    }
    
    return score;
  }

  // 更新评分
  async update(id: number, updateScoreDto: UpdateScoreDto): Promise<Score> {
    try {
      const score = await this.prisma.score.findUnique({
        where: { id },
      });
      
      if (!score) {
        throw new NotFoundException(`评分ID为 ${id} 的记录不存在`);
      }
      
      return this.prisma.score.update({
        where: { id },
        data: updateScoreDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('更新评分失败: ' + error.message);
    }
  }

  // 删除评分
  async remove(id: number): Promise<Score> {
    try {
      const score = await this.prisma.score.findUnique({
        where: { id },
      });
      
      if (!score) {
        throw new NotFoundException(`评分ID为 ${id} 的记录不存在`);
      }
      
      return this.prisma.score.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('删除评分失败: ' + error.message);
    }
  }

  // 计算选手在对阵中的总分
  async calculateCompetitorTotalScore(battleId: number, competitorId: number): Promise<any> {
    const scores = await this.prisma.score.findMany({
      where: {
        battleId,
        competitorId,
      },
    });
    
    if (scores.length === 0) {
      return {
        battleId,
        competitorId,
        techniqueAvg: 0,
        originalityAvg: 0,
        musicalityAvg: 0,
        executionAvg: 0,
        totalAvg: 0,
        judgeCount: 0,
      };
    }
    
    let techniqueSum = 0;
    let originalitySum = 0;
    let musicalitySum = 0;
    let executionSum = 0;
    let count = 0;
    
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
    
    if (count === 0) {
      return {
        battleId,
        competitorId,
        techniqueAvg: 0,
        originalityAvg: 0,
        musicalityAvg: 0,
        executionAvg: 0,
        totalAvg: 0,
        judgeCount: 0,
      };
    }
    
    const techniqueAvg = parseFloat((techniqueSum / count).toFixed(2));
    const originalityAvg = parseFloat((originalitySum / count).toFixed(2));
    const musicalityAvg = parseFloat((musicalitySum / count).toFixed(2));
    const executionAvg = parseFloat((executionSum / count).toFixed(2));
    const totalAvg = parseFloat(((techniqueAvg + originalityAvg + musicalityAvg + executionAvg) / 4).toFixed(2));
    
    return {
      battleId,
      competitorId,
      techniqueAvg,
      originalityAvg,
      musicalityAvg,
      executionAvg,
      totalAvg,
      judgeCount: count,
    };
  }
} 