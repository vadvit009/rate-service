import { IsString, IsNumber, IsNotEmpty, Min, IsEnum } from 'class-validator';

export class CreateRateDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  key: string;
}
