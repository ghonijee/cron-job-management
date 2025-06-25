import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronJob, ExecutionHistory } from '../entities';
import { JobRegistryService } from './services/job-registry.service';
import { JobSchedulerService } from './services/job-scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([CronJob, ExecutionHistory])],
  providers: [JobRegistryService, JobSchedulerService],
  controllers: [],
  exports: [JobRegistryService, JobSchedulerService],
})
export class JobsModule {}
