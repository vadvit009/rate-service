import { ApiProperty } from '@nestjs/swagger';

export class RateSymbolDto {
  @ApiProperty({ example: 'BTC' })
  symbol: string;
  @ApiProperty({ example: '96000' })
  price: string;
}
