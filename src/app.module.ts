import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { CronJob } from './entities/cron-job.entity';
import { ExecutionHistory } from './entities/execution-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database')!,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Category, CronJob, ExecutionHistory]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
