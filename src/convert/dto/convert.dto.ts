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
  @ApiProperty({ example: '1', type: 'string' })
  priceUsdt: string;

  @IsNumberString()
  @ApiProperty({ example: '1', type: 'string' })
  rate: string;

  @IsNumberString()
  @ApiProperty({ example: '1', type: 'string' })
  result: string;

  @IsDateString()
  @ApiProperty({ example: '01/30/2025, 3:12:48', type: 'number' })
  timestamp: number;
}
