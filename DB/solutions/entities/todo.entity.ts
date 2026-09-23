import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: 'active' })
  status!: string;

  @ManyToOne(() => User, (user) => user.todos, { onDelete: 'CASCADE' })
  user!: User;
}
