import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AssetTypes } from '../types/asset.types';

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

  @Column({ type: 'enum', enum: AssetTypes, default: null })
  type: AssetTypes;
}
