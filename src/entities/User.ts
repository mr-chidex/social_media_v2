import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';

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

  @ManyToOne((type) => User, (user) => user.followers)
  followers_parent: User;

  @OneToMany((type) => User, (user) => user.followers_parent)
  followers: User[];

  @ManyToOne((type) => User, (user) => user.following)
  follow_parent: User;

  @OneToMany((type) => User, (user) => user.follow_parent)
  following: User[];

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
