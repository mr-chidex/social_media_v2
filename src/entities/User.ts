import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Like } from './Like';
import { Post } from './Post';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 20,
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column('simple-json', { nullable: true })
  profilePic: { url: string; id: string };

  @Column('simple-json', { nullable: true })
  coverPic: { url: string; id: string };

  @Column({
    default: false,
  })
  isAdmin: boolean;

  @OneToMany(() => User, (user) => user.follower, { cascade: true })
  followers: User[];

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  follower: User;

  @OneToMany(() => User, (user) => user.following, { cascade: true })
  followings: User[];

  @ManyToOne(() => User, (user) => user.followings, { onDelete: 'CASCADE' })
  following: User;

  // @ManyToMany(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  // @JoinTable()
  // followers: User[];

  // @ManyToMany(() => User, (user) => user.followings, { onDelete: 'CASCADE' })
  // @JoinTable()
  // followings: User[];

  @Column({ type: 'text', default: '', nullable: true })
  biography: string;

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user, { cascade: true })
  likes: Like[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
