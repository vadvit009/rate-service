import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AssetTypes } from '../types/asset.types';
import { ApiProperty } from '@nestjs/swagger';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  @ApiProperty({ example: 'BTC' })
  symbol: string;

  @Index()
  @Column()
  @ApiProperty({ example: 'bitcoin' })
  name: string;

  @Column({ type: 'enum', enum: AssetTypes, default: null })
  @ApiProperty({ enum: AssetTypes })
  type: AssetTypes;
}
