import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  cryptoComSymbols,
  globalSymbols,
} from '../../rate/consts/symbols.const';
import { ConfigService } from '@nestjs/config';
import { ProviderService, RateKeys } from '../types/provider.types';
import { AxiosErrorHelper } from '../helpers/axios-error.helper';

@Injectable()
export class CryptoComService implements ProviderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly axiosErrorHelper: AxiosErrorHelper,
  ) {}

  readonly logger = new Logger(CryptoComService.name);
  readonly baseUrl = this.configService.get<string>(
    'CRYPTOCOM_URL',
    'https://api.crypto.com/exchange/v1',
  );
  readonly providerKey = this.configService.get<string>('CRYPTOCOM_KEY');

  async fetchRates(symbols = cryptoComSymbols): Promise<RateKeys> {
    const prices = {} as RateKeys;
    try {
      const url = `${this.baseUrl}/public/get-tickers`;
      const { data } = await axios.get(url);
      for (const { a: price, i: symbol } of data.result.data) {
        if (symbols.includes(symbol)) {
          const normalizeSymbol = globalSymbols.cryptoCom[symbol];
          prices[normalizeSymbol] = price;
        }
      }
    } catch (e) {
      this.axiosErrorHelper.handleAxiosError(e, this.constructor.name);
    }
    return prices;
  }
}
