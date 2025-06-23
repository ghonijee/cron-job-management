import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { CronJob } from './cron-job.entity';

export enum ExecutionStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  TIMEOUT = 'timeout',
  RETRY = 'retry',
}

@Entity('execution_histories')
@Index(['cronJobId', 'executedAt'])
@Index(['status'])
export class ExecutionHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: ExecutionStatus })
  status!: ExecutionStatus;

  @Column()
  @IsNumber()
  httpStatusCode!: number;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  responseBody!: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  errorMessage!: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  executionTimeMs!: number;

  @Column({ default: 1 })
  attemptNumber!: number;

  @CreateDateColumn()
  executedAt!: Date;

  @ManyToOne(() => CronJob, (cronJob) => cronJob.executionHistories, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  cronJob!: CronJob;

  @Column()
  cronJobId!: number;
}
