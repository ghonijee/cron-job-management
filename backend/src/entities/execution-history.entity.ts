import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { CronJob } from './cron-job.entity';

export enum ExecutionStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  TIMEOUT = 'timeout',
  RETRYING = 'retrying',
  RUNNING = 'running',
}

export enum TriggerType {
  SCHEDULED = 'scheduled',
  MANUAL = 'manual',
}

@Entity('execution_histories')
@Index(['cronJobId', 'createdAt'])
@Index(['status'])
@Index(['triggerType'])
export class ExecutionHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  cronJobId!: number;

  @Column({ type: 'enum', enum: ExecutionStatus })
  status!: ExecutionStatus;

  @Column({ type: 'enum', enum: TriggerType })
  triggerType!: TriggerType;

  @Column({ type: 'datetime' })
  startedAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt?: Date;

  @Column({ default: 0 })
  duration!: number; // in milliseconds

  @Column({ nullable: true })
  httpStatusCode?: number;

  @Column({ type: 'text', nullable: true })
  requestBody?: string;

  @Column({ type: 'json', nullable: true })
  requestHeaders?: Record<string, string>;

  @Column({ type: 'text', nullable: true })
  responseBody?: string;

  @Column({ type: 'json', nullable: true })
  responseHeaders?: Record<string, string>;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'text', nullable: true })
  errorStack?: string;

  @Column({ default: 0 })
  retryAttempt!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => CronJob, (cronJob) => cronJob.executionHistories, {
    onDelete: 'CASCADE'
  })
  cronJob!: CronJob;
}