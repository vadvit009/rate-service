import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { ProviderService, RateKeys } from '../types/provider.types';
import { binanceSymbols, globalSymbols } from '../../rate/consts/symbols.const';
import { AxiosErrorHelper } from '../helpers/axios-error.helper';

@Injectable()
export class BinanceService implements ProviderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly axiosErrorHelper: AxiosErrorHelper,
  ) {}

  readonly logger = new Logger(BinanceService.name);
  readonly baseUrl = this.configService.get(
    'BINANCE_URL',
    'https://api3.binance.com/api/v3',
  );

  async fetchRates(symbols = binanceSymbols): Promise<RateKeys> {
    const prices = {} as RateKeys;
    try {
      const url = `${this.baseUrl}/ticker/price?symbols=["${symbols.join('","')}"]`;
      const { data } = await axios.get(url);
      for (const { price, symbol } of data) {
        const normalizeSymbol = globalSymbols.binance[symbol];
        prices[normalizeSymbol] = price;
      }
    } catch (e) {
      this.axiosErrorHelper.handleAxiosError(e, this.constructor.name);
    }
    return prices;
  }
}
