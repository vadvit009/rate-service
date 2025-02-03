import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUppercase,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertInDto {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @ApiProperty({ example: 'BTC' })
  from: string;

  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @ApiProperty({ example: 'USD' })
  to: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ example: '1', type: 'string' })
  amount: number | string;
}

export class ConvertOutDto {
  @IsNumberString()
  @ApiProperty({ example: '4.1400', type: 'string' })
  toPrice: string;

  @IsNumberString()
  @ApiProperty({ example: '95378.2913', type: 'string' })
  fromPrice: string;

  @IsNumberString()
  @ApiProperty({ example: '394866.1260', type: 'string' })
  rate: string;

  @IsNumberString()
  @ApiProperty({ example: '394866.1260', type: 'string' })
  convertAmount: string;

  @IsDateString()
  @ApiProperty({ example: '1738579257223', type: 'number' })
  timestamp: number;
}
