import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ default: 'admin' })
  role!: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin!: Date | null;
}