import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';

import { RateService } from './rate.service';
import { RateSchedulerService } from './services/rate-scheduler.service';
import { CreateRateDto } from './dtos/create-rate.dto';
import { RateHistory } from './entities/rate-history.entity';
import { RateAllDto } from './dtos/rate-all.dto';
import { RateSymbolDto } from './dtos/rate-by-symbol.dto';

@Controller('rates')
export class RateController {
  constructor(
    private readonly rateService: RateService,
    private readonly schedulerService: RateSchedulerService,
  ) {}

  @Get('/all')
  @ApiOkResponse({ type: RateAllDto })
  async getAll() {
    const rates = await this.rateService.getAllLatestRates();
    return rates;
  }

  @Get(':symbol')
  @ApiParam({ name: 'symbol' })
  @ApiOkResponse({ type: RateSymbolDto })
  async getRate(@Param('symbol') symbol: string): Promise<RateSymbolDto> {
    const price = await this.rateService.getRate(symbol);
    return { symbol, price };
  }

  @Get(':symbol/history')
  @ApiParam({ name: 'symbol' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOkResponse({ type: RateHistory, isArray: true })
  async getHistory(
    @Param('symbol') symbol: string,
    @Query('limit') limit?: number,
  ) {
    const history = await this.rateService.getHistory(symbol, limit || 100);
    return history;
  }

  @Get(':symbol/hourly')
  async getHourlyAggregated(
    @Param('symbol') symbol: string,
    @Query('limit') limit = 24,
  ) {
    return this.rateService.getAggregatedHistory(symbol, 'h', +limit);
  }

  @Get(':symbol/daily')
  async getDailyAggregated(
    @Param('symbol') symbol: string,
    @Query('limit') limit = 1,
  ) {
    return this.rateService.getAggregatedHistory(symbol, 'd', +limit);
  }

  @Post('update')
  async forceUpdate() {
    await this.schedulerService.updateRates();
    return { message: 'Rates update triggered' };
  }

  @Post()
  async createRate(@Body() createRateDto: CreateRateDto) {
    return this.rateService.createRate(createRateDto);
  }
}
