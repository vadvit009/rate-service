import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import {
  coinMarketCapSymbols,
  globalSymbols,
} from '../../rate/consts/symbols.const';
import { ConfigService } from '@nestjs/config';
import { ProviderService, RateKeys } from '../types/provider.types';
import { AxiosErrorHelper } from '../helpers/axios-error.helper';

@Injectable()
export class CoinMarketCapService implements ProviderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly axiosErrorHelper: AxiosErrorHelper,
  ) {}

  readonly baseUrl = this.configService.get(
    'CMC_URL',
    'https://pro-api.coinmarketcap.com/v1',
  );
  readonly providerKey = this.configService.get('CMC_API_KEY');
  readonly logger = new Logger(CoinMarketCapService.name);

  async fetchRates(symbols = coinMarketCapSymbols): Promise<RateKeys> {
    const prices = {} as RateKeys;
    try {
      const response = await axios.get(
        `${this.baseUrl}/cryptocurrency/quotes/latest`,
        {
          params: { symbol: symbols.join(',') },
          headers: { 'X-CMC_PRO_API_KEY': this.providerKey },
        },
      );

      for (const symbol of symbols) {
        const cryptoData = response.data.data[symbol];
        const normalizeSymbol = globalSymbols.coinmarketcap[symbol];
        prices[normalizeSymbol] = cryptoData.quote.USD.price;
      }
    } catch (e) {
      this.axiosErrorHelper.handleAxiosError(e, this.constructor.name);
    }
    return prices;
  }
}
