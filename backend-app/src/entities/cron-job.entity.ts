import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import {
  IsString,
  IsUrl,
  IsBoolean,
  IsOptional,
  IsJSON,
} from 'class-validator';
import { User } from './user.entity';
import { Category } from './category.entity';
import { ExecutionHistory } from './execution-history.entity';

export enum JobStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
}

@Entity('cron_jobs')
@Index(['status', 'isActive'])
@Index(['cronSchedule'])
export class CronJob {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  name!: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  description!: string;

  @Column()
  @IsUrl()
  endpoint!: string;

  @Column({ default: 'GET' })
  @IsString()
  httpMethod!: string;

  @Column({ type: 'json', nullable: true })
  @IsJSON()
  @IsOptional()
  headers!: Record<string, string>;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  payload!: string;

  @Column()
  @IsString()
  cronSchedule!: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.ACTIVE })
  status!: JobStatus;

  @Column({ default: true })
  @IsBoolean()
  isActive!: boolean;

  @Column({ default: 30 })
  timeoutSeconds!: number;

  @Column({ default: 3 })
  retryCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.cronJobs, { nullable: false })
  user!: User;

  @ManyToOne(() => Category, (category) => category.cronJobs, {
    nullable: true,
  })
  category!: Category;

  @OneToMany(() => ExecutionHistory, (history) => history.cronJob)
  executionHistories!: ExecutionHistory[];
}
