import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import {
  coingeckoSymbols,
  globalSymbols,
} from '../../rate/consts/symbols.const';
import { ProviderService, RateKeys } from '../types/provider.types';
import { AxiosErrorHelper } from '../helpers/axios-error.helper';

@Injectable()
export class CoingeckoService implements ProviderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly axiosErrorHelper: AxiosErrorHelper,
  ) {}

  readonly logger = new Logger(CoingeckoService.name);
  readonly baseUrl = this.configService.get<string>(
    'COINGECKO_URL',
    'https://api.coingecko.com/api/v3',
  );
  readonly providerKey = this.configService.get('COINGECKO_KEY');

  async fetchFiatRates(symbols = coingeckoSymbols, fiat: string = 'usd') {
    const prices = {} as RateKeys;
    try {
      const ids = symbols.join(',');
      const currency = fiat;
      const url = `${this.baseUrl}/simple/price`;

      const { data } = await axios.get(url, {
        params: {
          ids,
          vs_currencies: currency,
          x_cg_demo_api_key: this.providerKey,
        },
      });
      this.logger.debug({ data, currency, symbols });
      Object.entries(data).forEach(([coinId, coinData]) => {
        const normalizeSymbol = globalSymbols.coingecko[coinId];
        prices[normalizeSymbol] = coinData[currency];
      });
    } catch (e) {
      this.axiosErrorHelper.handleAxiosError(e, this.constructor.name);
    }
    return prices;
  }

  async fetchRates(symbols = coingeckoSymbols): Promise<RateKeys> {
    return this.fetchFiatRates(symbols);
  }
}
