import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('rate_history')
export class RateHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  symbol: string;

  @Column('decimal', { precision: 18, scale: 8 })
  price: number;

  @Index()
  @Column()
  from: string;

  @CreateDateColumn()
  createdAt: Date;
}
