import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUppercase,
} from 'class-validator';

export class ConvertInDto {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  from: string;

  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  to: string;

  @IsNumberString()
  @IsNotEmpty()
  amount: number | string;
}

export class ConvertOutDto {
  @IsNumberString()
  priceUsdt: string;

  @IsNumberString()
  rate: string;

  @IsNumberString()
  result: string;

  @IsDateString()
  timestamp: number;
}
