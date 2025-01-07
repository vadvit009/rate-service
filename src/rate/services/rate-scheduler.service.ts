import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RateFetcherService } from './rate-fetcher.service';
import { RateService } from '../rate.service';
import { RateAlertService } from './rate-alert.service';

@Injectable()
export class RateSchedulerService {
  private readonly logger = new Logger(RateSchedulerService.name);

  constructor(
    private readonly fetcherService: RateFetcherService,
    private readonly rateService: RateService,
    private readonly alertService: RateAlertService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateRates(): Promise<void> {
    this.logger.log('updateRates job started');

    const allData = await this.fetcherService.fetchAllProviders();

    for (const symbol in allData) {
      this.logger.log({ symbol });
      const priceArray = allData[symbol] || [];
      if (priceArray.length > 0) {
        const aggregatedPrice = this.aggregatePrices(priceArray);

        await this.rateService.createRate({
          symbol,
          price: aggregatedPrice,
          from: 'coingecko',
        });

        this.alertService.checkThreshold(symbol, aggregatedPrice);
      }
    }

    this.logger.log('updateRates job completed');
  }

  private aggregatePrices(prices: number[]) {
    return prices.reduce((acc, el) => acc + +el, 0) / prices.length;
  }
}
