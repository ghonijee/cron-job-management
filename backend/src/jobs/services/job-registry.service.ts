import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { ScheduledTask } from 'node-cron';
import {
  IJobRegistry,
  JobRegistryEntry,
} from '../interfaces/job-registry.interface';

@Injectable()
export class JobRegistryService implements IJobRegistry {
  private readonly logger = new Logger(JobRegistryService.name);
  private readonly registeredJobs = new Map<string, ScheduledTask>();
  private readonly jobMetadata = new Map<string, JobRegistryEntry>();

  async registerJob(
    jobId: string,
    cronPattern: string,
    callback: () => void,
  ): Promise<boolean> {
    try {
      // Validate cron pattern
      if (!cron.validate(cronPattern)) {
        this.logger.error(
          `Invalid cron pattern for job ${jobId}: ${cronPattern}`,
        );
        return false;
      }

      // Unregister existing job if present
      if (this.isJobRegistered(jobId)) {
        await this.unregisterJob(jobId);
      }

      // Create and register new scheduled task
      const scheduledTask = cron.schedule(cronPattern, callback, {
        timezone: 'UTC',
      });

      // Stop the task initially - it will be started when needed
      scheduledTask.stop();

      this.registeredJobs.set(jobId, scheduledTask);
      this.jobMetadata.set(jobId, {
        jobId,
        cronPattern,
        scheduledTask,
        isActive: false,
        createdAt: new Date(),
      });

      this.logger.log(
        `Job ${jobId} registered successfully with pattern: ${cronPattern}`,
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to register job ${jobId}:`, error);
      return false;
    }
  }

  unregisterJob(jobId: string): Promise<boolean> {
    try {
      const scheduledTask = this.registeredJobs.get(jobId);
      if (scheduledTask) {
        scheduledTask.destroy();
        this.registeredJobs.delete(jobId);
        this.jobMetadata.delete(jobId);
        this.logger.log(`Job ${jobId} unregistered successfully`);
        return Promise.resolve(true);
      }

      this.logger.warn(`Attempted to unregister non-existent job: ${jobId}`);
      return Promise.resolve(false);
    } catch (error) {
      this.logger.error(`Failed to unregister job ${jobId}:`, error);
      return Promise.resolve(false);
    }
  }

  async updateJob(
    jobId: string,
    cronPattern: string,
    callback: () => void,
  ): Promise<boolean> {
    try {
      const metadata = this.jobMetadata.get(jobId);
      const wasActive = metadata?.isActive || false;

      // Unregister old job
      await this.unregisterJob(jobId);

      // Register new job
      const success = await this.registerJob(jobId, cronPattern, callback);

      // Restore active state if job was previously active
      if (success && wasActive) {
        const scheduledTask = this.registeredJobs.get(jobId);
        if (scheduledTask) {
          scheduledTask.start();
          const updatedMetadata = this.jobMetadata.get(jobId);
          if (updatedMetadata) {
            updatedMetadata.isActive = true;
          }
        }
      }

      return success;
    } catch (error) {
      this.logger.error(`Failed to update job ${jobId}:`, error);
      return false;
    }
  }

  getRegisteredJob(jobId: string): ScheduledTask | null {
    return this.registeredJobs.get(jobId) || null;
  }

  getAllRegisteredJobs(): Map<string, ScheduledTask> {
    return new Map(this.registeredJobs);
  }

  isJobRegistered(jobId: string): boolean {
    return this.registeredJobs.has(jobId);
  }

  getJobCount(): number {
    return this.registeredJobs.size;
  }

  startJob(jobId: string): boolean {
    try {
      const scheduledTask = this.registeredJobs.get(jobId);
      const metadata = this.jobMetadata.get(jobId);

      if (scheduledTask && metadata) {
        scheduledTask.start();
        metadata.isActive = true;
        this.logger.log(`Job ${jobId} started successfully`);
        return true;
      }

      this.logger.warn(`Cannot start non-existent job: ${jobId}`);
      return false;
    } catch (error) {
      this.logger.error(`Failed to start job ${jobId}:`, error);
      return false;
    }
  }

  stopJob(jobId: string): boolean {
    try {
      const scheduledTask = this.registeredJobs.get(jobId);
      const metadata = this.jobMetadata.get(jobId);

      if (scheduledTask && metadata) {
        scheduledTask.stop();
        metadata.isActive = false;
        this.logger.log(`Job ${jobId} stopped successfully`);
        return true;
      }

      this.logger.warn(`Cannot stop non-existent job: ${jobId}`);
      return false;
    } catch (error) {
      this.logger.error(`Failed to stop job ${jobId}:`, error);
      return false;
    }
  }

  getJobMetadata(jobId: string): JobRegistryEntry | null {
    return this.jobMetadata.get(jobId) || null;
  }

  getAllJobMetadata(): JobRegistryEntry[] {
    return Array.from(this.jobMetadata.values());
  }

  updateLastExecuted(jobId: string): void {
    const metadata = this.jobMetadata.get(jobId);
    if (metadata) {
      metadata.lastExecuted = new Date();
    }
  }
}
