import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'BTC' })
  symbol: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: '96000' })
  price: number;

  @IsString()
  @ApiProperty()
  key: string;
}
