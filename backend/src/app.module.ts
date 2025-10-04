import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { BattlesModule } from './battles/battles.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { CompetitorsModule } from './competitors/competitors.module';
import { LogsModule } from './logs/logs.module';

const envFilePath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', envFilePath], // 先加载通用配置，再加载环境特定配置
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BattlesModule,
    CompetitionsModule,
    CompetitorsModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { } 