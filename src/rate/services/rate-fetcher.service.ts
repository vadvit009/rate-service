import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  BinanceService,
  CryptoComService,
  CoingeckoService,
  CoinMarketCapService,
} from '../../providers/services';
import { ProvidersMode, RateKeys } from '../../providers/types/provider.types';

@Injectable()
export class RateFetcherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly binanceService: BinanceService,
    private readonly cryptoComService: CryptoComService,
    private readonly coingeckoService: CoingeckoService,
    private readonly coinMarketCapService: CoinMarketCapService,
  ) {}

  private getRatesPromises() {
    const providerMode = this.configService.get<ProvidersMode>('PROVIDER');
    let values = [];
    if (providerMode === ProvidersMode.ALL) {
      values.push(this.binanceService.fetchRates());
      values.push(this.cryptoComService.fetchRates());
      values.push(this.coingeckoService.fetchRates());
      values.push(this.coinMarketCapService.fetchRates());
    }
    if (providerMode === ProvidersMode.CRYPTOCOM) {
      values.push(this.cryptoComService.fetchRates());
    }
    if (providerMode === ProvidersMode.COINGECKO) {
      values.push(this.coingeckoService.fetchRates());
    }
    if (providerMode === ProvidersMode.COINMARKETCAP) {
      values.push(this.coinMarketCapService.fetchRates());
    }
    return values;
  }

  async fetchAllProviders() {
    const data = await Promise.allSettled<RateKeys>(this.getRatesPromises());
    return data
      .filter((el) => el.status === 'fulfilled')
      .reduce(
        (acc, entry) => {
          for (const [key, value] of Object.entries(entry.value)) {
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(value);
          }
          return acc;
        },
        {} as Record<string, string[]>,
      );
  }
}
