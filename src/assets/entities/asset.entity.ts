import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  symbol: string;

  @Index()
  @Column()
  name: string;

  @Column()
  type: 'fiat' | 'crypto';
}
