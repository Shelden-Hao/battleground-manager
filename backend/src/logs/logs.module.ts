import { Module } from "@nestjs/common";
import { utilities, WinstonModule } from "nest-winston";
import { ConfigService } from "@nestjs/config";
import * as Winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const consoleTransport = new Winston.transports.Console({
          level: "info",
          format: Winston.format.combine(
            Winston.format.timestamp(),
            utilities.format.nestLike()
          ),
        });

        const dailyTransport = new DailyRotateFile({
          level: config.get("LOG_LEVEL") || "info",
          filename: "logs/app-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: Winston.format.combine(
            Winston.format.timestamp(),
            Winston.format.simple()
          ),
        });

        const dailyInfoTransport = new DailyRotateFile({
          level: config.get("LOG_LEVEL") || "warn",
          filename: "logs/app-info-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          format: Winston.format.combine(
            Winston.format.timestamp(),
            Winston.format.simple()
          ),
        });
        return {
          transports: [
            consoleTransport,
            ...(config.get("LOG_ON")
              ? [dailyTransport, dailyInfoTransport]
              : []),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class LogsModule {}
