import { globalSymbols } from '../consts/symbols.const';
import { ApiProperty } from '@nestjs/swagger';

type ValidKeys = keyof typeof globalSymbols.coinmarketcap;

export class RateAllDto implements Record<ValidKeys, string> {
  @ApiProperty({ example: '96000' })
  BTC: string;
  @ApiProperty({ example: '96000' })
  ETH: string;
  @ApiProperty({ example: '96000' })
  USDT: string;
  @ApiProperty({ example: '96000' })
  TRX: string;
  @ApiProperty({ example: '96000' })
  AMB: string;
  @ApiProperty({ example: '96000' })
  APT: string;
  @ApiProperty({ example: '96000' })
  ARB: string;
  @ApiProperty({ example: '96000' })
  BCH: string;
  @ApiProperty({ example: '96000' })
  BNB: string;
  @ApiProperty({ example: '96000' })
  BTT: string;
  @ApiProperty({ example: '96000' })
  DAI: string;
  @ApiProperty({ example: '96000' })
  DASH: string;
  @ApiProperty({ example: '96000' })
  DOGE: string;
  @ApiProperty({ example: '96000' })
  DOT: string;
  @ApiProperty({ example: '96000' })
  ETC: string;
  @ApiProperty({ example: '96000' })
  NEAR: string;
  @ApiProperty({ example: '96000' })
  POL: string;
  @ApiProperty({ example: '96000' })
  SOL: string;
  @ApiProperty({ example: '96000' })
  TON: string;
  @ApiProperty({ example: '96000' })
  XLM: string;
  @ApiProperty({ example: '96000' })
  XMR: string;
  @ApiProperty({ example: '96000' })
  XRP: string;
  @ApiProperty({ example: '96000' })
  ZEC: string;
  @ApiProperty({ type: Date })
  timestamp: Date;
}
