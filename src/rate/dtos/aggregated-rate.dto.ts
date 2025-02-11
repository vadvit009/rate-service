import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AggregatedRateDto {
  @ApiProperty({ type: Date })
  period: Date;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: '96000' })
  averagePrice: number;
}
