import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('rates')
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  @ApiProperty({ example: 'BTC' })
  symbol: string;

  @Column('decimal', { precision: 18, scale: 8 })
  @ApiProperty({ example: '96000' })
  price: number;

  @UpdateDateColumn()
  @ApiProperty({ example: '1738243702' })
  updatedAt: Date;
}
