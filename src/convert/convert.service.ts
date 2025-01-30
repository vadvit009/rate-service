import { BigNumber } from 'bignumber.js';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { ConvertInDto, ConvertOutDto } from './dto/convert.dto';
import { RateService } from '../rate/rate.service';
import { RateFetcherService } from '../rate/services/rate-fetcher.service';
import { AssetsService } from '../assets/assets.service';
import { globalSymbols } from '../rate/consts/symbols.const';
import { RedisService } from '../redis/redis.service';
import { FIAT } from '../common/constants';

@Injectable()
export class ConvertService {
  logger = new Logger(ConvertService.name);
  private readonly fiatRates = new Map<string, string>([
    ['usd', '1'],
    ['eur', '0.95'],
    // ['uah', 43],
  ]);

  constructor(
    private readonly rateService: RateService,
    private readonly rateFetcherService: RateFetcherService,
    private readonly assetsService: AssetsService,
    private readonly redisService: RedisService,
  ) {}

  private async validateConversion(convertDto: ConvertInDto) {
    const fromSupported = await this.assetsService.findOne({
      symbol: convertDto.from,
    });
    if (!fromSupported) {
      throw new BadRequestException(
        `Currency ${convertDto.from} not supported`,
      );
    }
    const toSupported = await this.assetsService.findOne({
      symbol: convertDto.to,
    });
    if (!toSupported) {
      throw new BadRequestException(`Currency ${convertDto.to} not supported`);
    }

    if (toSupported.type === 'fiat' && fromSupported.type === 'fiat') {
      throw new BadRequestException(`Fiat-to-fiat conversion not supported`);
    }

    return {
      from: fromSupported,
      to: toSupported,
      amount: +convertDto.amount,
    };
  }

  async getConvertion(convertDto: ConvertInDto): Promise<unknown> {
    const { from, to, amount } = await this.validateConversion(convertDto);
    const timestamp = Date.now();

    const fromPrice =
      from.type === 'fiat'
        ? await this.getFiatPrice(from.symbol.toLowerCase())
        : await this.rateService.getRate(from.symbol.toUpperCase());

    const toPrice =
      to.type === 'fiat'
        ? await this.getFiatPrice(to.symbol.toLowerCase())
        : await this.rateService.getRate(to.symbol.toUpperCase());
    this.logger.debug({ from, fromPrice, to, toPrice, convertDto });

    const rate =
      to.type === 'fiat'
        ? new BigNumber(fromPrice).multipliedBy(toPrice).toFixed(4)
        : new BigNumber(fromPrice).div(toPrice).toFixed(4);
    const result = new BigNumber(rate).multipliedBy(amount).toFixed(4);
    return { toPrice, fromPrice, rate, convertAmount: result, timestamp };
  }

  async getFiatPrice(symbol: string) {
    const data = await this.redisService.get(FIAT, symbol);
    if (!data) {
      return await this.fetchRateForUnknownFiat(symbol);
    }
    return data;
  }

  async fetchRateForUnknownFiat(symbol: string): Promise<string> {
    const rates = await this.rateFetcherService.fetchFromCoinGecko(
      ['tether'],
      symbol,
    );
    this.logger.debug({ rates, symbol });
    const rate = rates['USDT'].toFixed(4);

    await this.redisService.set(
      FIAT,
      symbol,
      rate,
      this.redisService.ttl1HourMin,
    );
    this.logger.debug({ rate });
    return rate;
  }
}
