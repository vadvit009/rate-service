import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rates')
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  symbol: string;

  @Column('decimal', { precision: 18, scale: 8 })
  price: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
