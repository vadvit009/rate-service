import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BigNumber } from 'bignumber.js';

import { RateFetcherService } from './rate-fetcher.service';
import { RateService } from '../rate.service';
import { RedisService } from '../../redis/redis.service';
import { RATES } from '../consts/keys.const';

@Injectable()
export class RateSchedulerService {
  private readonly logger = new Logger(RateSchedulerService.name);

  constructor(
    private readonly fetcherService: RateFetcherService,
    private readonly rateService: RateService,
    private readonly redisService: RedisService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateRates(): Promise<void> {
    this.logger.log('updateRates job started');
    const key = await this.redisService.setLatest(RATES);

    const allData = await this.fetcherService.fetchAllProviders();

    for (const symbol in allData) {
      this.logger.log({ symbol });
      const priceArray = allData[symbol] || [];
      if (priceArray.length > 0) {
        const aggregatedPrice = this.aggregatePrices(priceArray);

        await this.rateService.createRate({
          symbol,
          price: aggregatedPrice,
          key,
        });
      }
    }
    await this.rateService.triggerUpdate();
    this.logger.log('updateRates job completed');
  }

  private aggregatePrices(prices: number[]) {
    return BigNumber.sum(...prices)
      .div(prices.length)
      .toNumber();
  }
}
