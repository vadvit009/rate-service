import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssetTypes } from '../types/asset.types';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'BTC' })
  symbol: string;

  @IsString()
  @ApiProperty({ example: 'bitcoin' })
  name: string;

  @IsEnum(AssetTypes)
  @ApiProperty({ enum: AssetTypes })
  type: AssetTypes;
}
