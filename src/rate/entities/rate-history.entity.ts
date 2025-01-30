import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('rate_history')
export class RateHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  @ApiProperty({ example: 'BTC' })
  symbol: string;

  @Column('decimal', { precision: 18, scale: 8 })
  @ApiProperty({ example: '96000' })
  price: number;

  @CreateDateColumn()
  @ApiProperty({ example: '1738243702' })
  createdAt: Date;
}
