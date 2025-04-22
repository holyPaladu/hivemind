import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Skill } from './skill.entity';
import { UserSettings } from './setting.entity';
import { Activity } from './activity.entity';
import { JobHistory } from './history.entity';
// import { Portfolio } from './portfolio.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar?: string;

  @Column({
    type: 'enum',
    enum: ['client', 'freelancer', 'guest'],
    default: 'guest',
  })
  role: 'client' | 'freelancer' | 'guest';

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Skill, (skill) => skill.user)
  skills: Skill[];

  @OneToOne(() => UserSettings, (setting) => setting.user)
  userSettings: UserSettings;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @OneToMany(() => JobHistory, (jobHistory) => jobHistory.user)
  jobHistory: JobHistory[];

  // @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  // portfolio: Portfolio[];
}
