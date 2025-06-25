import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronJob, ExecutionHistory } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([CronJob, ExecutionHistory])
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class JobsModule {}