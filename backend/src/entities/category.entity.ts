import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsHexColor, IsOptional } from 'class-validator';
import { CronJob } from './cron-job.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsString()
  name!: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  description!: string;

  @Column({ default: '#3B82F6' })
  @IsHexColor()
  color!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: false })
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => CronJob, (cronJob) => cronJob.category)
  cronJobs!: CronJob[];
}
