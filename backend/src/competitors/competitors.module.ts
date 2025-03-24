import { Module } from '@nestjs/common';
import { CompetitorsController } from './competitors.controller';
import { CompetitorsService } from './competitors.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CompetitorsController],
  providers: [CompetitorsService],
  exports: [CompetitorsService],
})
export class CompetitorsModule {} 