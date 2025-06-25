import { ScheduledTask } from 'node-cron';

export interface IJobRegistry {
  registerJob(
    jobId: string,
    cronPattern: string,
    callback: () => void,
  ): Promise<boolean>;
  unregisterJob(jobId: string): Promise<boolean>;
  updateJob(
    jobId: string,
    cronPattern: string,
    callback: () => void,
  ): Promise<boolean>;
  getRegisteredJob(jobId: string): ScheduledTask | null;
  getAllRegisteredJobs(): Map<string, ScheduledTask>;
  isJobRegistered(jobId: string): boolean;
  getJobCount(): number;
}

export interface IJobScheduler {
  scheduleJob(
    jobId: string,
    cronPattern: string,
    callback: () => void,
  ): Promise<void>;
  unscheduleJob(jobId: string): Promise<void>;
  rescheduleJob(
    jobId: string,
    cronPattern: string,
    callback: () => void,
  ): Promise<void>;
  startJob(jobId: string): Promise<void>;
  stopJob(jobId: string): Promise<void>;
  loadActiveJobs(): Promise<void>;
  validateCronPattern(pattern: string): boolean;
}

export interface JobRegistryEntry {
  jobId: string;
  cronPattern: string;
  scheduledTask: ScheduledTask;
  isActive: boolean;
  createdAt: Date;
  lastExecuted?: Date;
}
