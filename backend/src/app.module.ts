import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { BattlesModule } from './battles/battles.module';
import { CompetitionsModule } from './competitions/competitions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BattlesModule,
    CompetitionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 