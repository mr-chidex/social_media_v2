import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from './Post';
import { User } from './User';

@Entity('likes')
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post: Post;
}
