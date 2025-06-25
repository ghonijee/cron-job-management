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
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  IsIn,
} from 'class-validator';
import { User } from './user.entity';
import { Category } from './category.entity';
import { ExecutionHistory } from './execution-history.entity';

export enum JobStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
  ERROR = 'error',
}

export enum AuthType {
  NONE = 'none',
  BASIC = 'basic',
  BEARER = 'bearer',
  API_KEY = 'api_key',
}

@Entity('cron_jobs')
@Index(['status', 'isActive'])
@Index(['cronPattern'])
@Index(['userId', 'categoryId'])
@Index(['nextExecution'])
export class CronJob {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @Column({ nullable: true })
  categoryId?: number;

  @Column()
  @IsString()
  @Matches(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/)
  cronPattern!: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.INACTIVE })
  status!: JobStatus;

  @Column()
  @IsUrl()
  url!: string;

  @Column({ default: 'GET' })
  @IsString()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  method!: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  headers?: Record<string, string>;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  body?: string;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.NONE })
  authType!: AuthType;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  authConfig?: {
    username?: string;
    password?: string;
    token?: string;
    apiKey?: string;
    header?: string;
  };

  @Column({ default: 30 })
  @IsInt()
  @Min(5)
  @Max(300)
  timeout!: number; // in seconds

  @Column({ default: 3 })
  @IsInt()
  @Min(0)
  @Max(10)
  retryCount!: number;

  @Column({ default: 5000 })
  @IsInt()
  @Min(1000)
  @Max(60000)
  retryDelay!: number; // in milliseconds

  @Column({ default: true })
  @IsBoolean()
  isActive!: boolean;

  @Column({ nullable: false })
  userId!: number;

  @Column({ type: 'datetime', nullable: true })
  nextExecution?: Date;

  @Column({ type: 'datetime', nullable: true })
  lastExecution?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.cronJobs, { 
    nullable: false,
    onDelete: 'CASCADE'
  })
  user!: User;

  @ManyToOne(() => Category, (category) => category.cronJobs, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  category?: Category;

  @OneToMany(() => ExecutionHistory, (history) => history.cronJob, {
    cascade: true
  })
  executionHistories!: ExecutionHistory[];
}