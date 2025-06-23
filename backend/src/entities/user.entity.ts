import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { CronJob } from './cron-job.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column({ select: false })
  @IsString()
  @MinLength(8)
  password!: string;

  @Column()
  @IsString()
  firstName!: string;

  @Column()
  @IsString()
  lastName!: string;

  @Column({ default: 'user' })
  @IsString()
  role!: string;

  @Column({ nullable: true, select: false })
  refreshToken?: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => CronJob, (cronJob) => cronJob.user)
  cronJobs!: CronJob[];
}
