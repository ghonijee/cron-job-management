import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as cron from 'node-cron';
import { JobRegistryService } from './job-registry.service';
import { IJobScheduler } from '../interfaces/job-registry.interface';
import { CronJob, JobStatus } from '../../entities/cron-job.entity';

@Injectable()
export class JobSchedulerService implements IJobScheduler, OnModuleInit {
  private readonly logger = new Logger(JobSchedulerService.name);

  constructor(
    @InjectRepository(CronJob)
    private readonly cronJobRepository: Repository<CronJob>,
    private readonly jobRegistryService: JobRegistryService,
  ) { }

  async onModuleInit() {
    this.logger.log('Initializing Job Scheduler Service...');
    await this.loadActiveJobs();
    this.logger.log('Job Scheduler Service initialized successfully');
  }

  async scheduleJob(
    jobId: string,
    cronPattern: string,
    callback: () => void,
  ): Promise<void> {
    try {
      const success = await this.jobRegistryService.registerJob(
        jobId,
        cronPattern,
        callback,
      );
      if (!success) {
        throw new Error(`Failed to register job ${jobId}`);
      }

      const job = await this.cronJobRepository.findOne({
        where: { id: parseInt(jobId) },
      });
      if (job && job.status === JobStatus.ACTIVE && job.isActive) {
        this.jobRegistryService.startJob(jobId);
        this.logger.log(`Job ${jobId} scheduled and started successfully`);
      } else {
        this.logger.log(
          `Job ${jobId} scheduled but not started (status: ${job?.status}, isActive: ${job?.isActive})`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to schedule job ${jobId}:`, error);
      throw error;
    }
  }

  async unscheduleJob(jobId: string): Promise<void> {
    try {
      const success = await this.jobRegistryService.unregisterJob(jobId);
      if (!success) {
        this.logger.warn(
          `Job ${jobId} was not registered, skipping unschedule`,
        );
      } else {
        this.logger.log(`Job ${jobId} unscheduled successfully`);
      }
    } catch (error) {
      this.logger.error(`Failed to unschedule job ${jobId}:`, error);
      throw error;
    }
  }

  async rescheduleJob(
    jobId: string,
    cronPattern: string,
    callback: () => void,
  ): Promise<void> {
    try {
      const success = await this.jobRegistryService.updateJob(
        jobId,
        cronPattern,
        callback,
      );
      if (!success) {
        throw new Error(`Failed to reschedule job ${jobId}`);
      }

      const job = await this.cronJobRepository.findOne({
        where: { id: parseInt(jobId) },
      });
      if (job && job.status === JobStatus.ACTIVE && job.isActive) {
        this.jobRegistryService.startJob(jobId);
      }

      this.logger.log(
        `Job ${jobId} rescheduled successfully with pattern: ${cronPattern}`,
      );
    } catch (error) {
      this.logger.error(`Failed to reschedule job ${jobId}:`, error);
      throw error;
    }
  }

  async startJob(jobId: string): Promise<void> {
    try {
      if (!this.jobRegistryService.isJobRegistered(jobId)) {
        await this.loadJobFromDatabase(jobId);
      }

      const success = this.jobRegistryService.startJob(jobId);
      if (!success) {
        throw new Error(`Failed to start job ${jobId}`);
      }

      await this.cronJobRepository.update(parseInt(jobId), {
        status: JobStatus.ACTIVE,
        isActive: true,
      });
      this.logger.log(
        `Job ${jobId} started and database updated (status='active', isActive=true)`,
      );
    } catch (error) {
      this.logger.error(`Failed to start job ${jobId}:`, error);
      throw error;
    }
  }

  async stopJob(jobId: string): Promise<void> {
    try {
      const success = this.jobRegistryService.stopJob(jobId);
      if (!success) {
        this.logger.warn(
          `Job ${jobId} was not running, updating database only`,
        );
      }

      await this.cronJobRepository.update(parseInt(jobId), {
        status: JobStatus.INACTIVE,
        isActive: false,
      });

      this.logger.log(
        `Job ${jobId} stopped and database updated (status='inactive', isActive=false)`,
      );
    } catch (error) {
      this.logger.error(`Failed to stop job ${jobId}:`, error);
      throw error;
    }
  }

  async loadActiveJobs(): Promise<void> {
    try {
      const activeJobs = await this.cronJobRepository.find({
        where: {
          status: JobStatus.ACTIVE,
          isActive: true,
        },
        select: ['id', 'name', 'cronPattern', 'status', 'isActive'],
      });

      this.logger.log(
        `Loading ${activeJobs.length} active jobs (status='active' AND isActive=true)...`,
      );

      let loadedCount = 0;
      let failedCount = 0;

      for (const job of activeJobs) {
        try {
          await this.loadJobFromDatabase(job.id.toString());
          loadedCount++;
        } catch (error) {
          this.logger.error(
            `Failed to load job ${job.id} (${job.name}):`,
            error,
          );
          failedCount++;
        }
      }

      this.logger.log(
        `Job loading completed: ${loadedCount} successful, ${failedCount} failed`,
      );
    } catch (error) {
      this.logger.error('Failed to load active jobs:', error);
      throw error;
    }
  }

  private async loadJobFromDatabase(jobId: string): Promise<void> {
    const job = await this.cronJobRepository.findOne({
      where: { id: parseInt(jobId) },
    });
    if (!job) {
      throw new Error(`Job ${jobId} not found in database`);
    }

    const callback = this.createJobCallback(job);

    const success = await this.jobRegistryService.registerJob(
      job.id.toString(),
      job.cronPattern,
      callback,
    );
    if (!success) {
      throw new Error(`Failed to register job ${jobId} in registry`);
    }

    if (job.status === JobStatus.ACTIVE && job.isActive) {
      this.jobRegistryService.startJob(job.id.toString());
    }

    this.logger.debug(
      `Job ${jobId} loaded from database and registered (status: ${job.status}, isActive: ${job.isActive})`,
    );
  }

  private createJobCallback(job: CronJob): () => void {
    return () => {
      this.logger.log(`Executing job: ${job.name} (${job.id})`);
      this.jobRegistryService.updateLastExecuted(job.id.toString());

      // TODO: This will be integrated with JobExecutorService in T-017
      this.logger.log(`Job ${job.id} execution callback triggered`);
    };
  }

  validateCronPattern(pattern: string): boolean {
    return cron.validate(pattern);
  }

  getRegisteredJobsCount(): number {
    return this.jobRegistryService.getJobCount();
  }

  getJobStatus(jobId: string): { registered: boolean; active: boolean } {
    const metadata = this.jobRegistryService.getJobMetadata(jobId);
    return {
      registered: this.jobRegistryService.isJobRegistered(jobId),
      active: metadata?.isActive || false,
    };
  }

  getAllJobsStatus(): Array<{
    jobId: string;
    registered: boolean;
    active: boolean;
    lastExecuted?: Date;
  }> {
    return this.jobRegistryService.getAllJobMetadata().map((metadata) => ({
      jobId: metadata.jobId,
      registered: true,
      active: metadata.isActive,
      lastExecuted: metadata.lastExecuted,
    }));
  }
}
