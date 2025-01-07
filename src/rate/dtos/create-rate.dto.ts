import { IsString, IsNumber, IsNotEmpty, Min, IsEnum } from 'class-validator';
import { Providers } from '../types/rate.types';

export class CreateRateDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  from: Providers;
}
