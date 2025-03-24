import { Module } from '@nestjs/common';
import { BattlesController } from './battles.controller';
import { BattlesService } from './battles.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';

@Module({
  imports: [PrismaModule],
  controllers: [BattlesController, ScoreController],
  providers: [BattlesService, ScoreService],
  exports: [BattlesService, ScoreService],
})
export class BattlesModule {} 