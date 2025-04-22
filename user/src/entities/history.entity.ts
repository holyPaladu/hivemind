import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('job_history')
export class JobHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  projectName: string;

  @Column({ type: 'text' })
  projectDescription: string;

  @Column({ type: 'varchar', length: 255 })
  clientName: string;

  @ManyToOne(() => User, (user) => user.jobHistory)
  user: User;
}
