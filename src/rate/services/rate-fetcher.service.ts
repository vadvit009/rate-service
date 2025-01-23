import axios, { AxiosError, isAxiosError } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  binanceSymbols,
  coingeckoSymbols,
  coinMarketCapSymbols,
  globalSymbols,
} from '../consts/symbols.const';

@Injectable()
export class RateFetcherService {
  private readonly logger = new Logger(RateFetcherService.name);

  constructor(private readonly configService: ConfigService) {}

  private handleAxiosError(e: unknown, provider: string) {
    if (isAxiosError(e)) {
      const axiosError = e as AxiosError;
      const { url, method, headers } = axiosError.response.config;
      this.logger.error(
        {
          error: axiosError.response.data,
          config: { url, method, headers },
          status: axiosError.response.status,
        },
        `Provider [${provider}] axios error`,
      );
    } else {
      this.logger.error(e, `Provider [${provider}] fetch error`);
    }
  }

  async fetchFromCoinGecko(
    symbols: string[],
    fiat?: string,
  ): Promise<Record<string, number> | void> {
    try {
      const ids = symbols.join(',');
      const currency = fiat || 'usd';
      const url = `https://api.coingecko.com/api/v3/simple/price`;
      const { data } = await axios.get(url, {
        params: {
          ids,
          vs_currencies: currency,
          x_cg_demo_api_key: this.configService.get('COINGECKO_KEY'),
        },
      });

      const result: Record<string, number> = {};
      Object.entries(data).forEach(([coinId, coinData]) => {
        const normalizeSymbol = globalSymbols.coingecko[coinId];
        result[normalizeSymbol] = (coinData as any)[currency];
      });

      return result;
    } catch (error) {
      this.handleAxiosError(error, 'CoinGecko');
    }
  }

  async fetchFromCoinMarketCap(
    symbols: string[],
  ): Promise<Record<string, number>> {
    let prices = {};
    try {
      const apiKey = this.configService.get('CMC_API_KEY');
      const response = await axios.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        {
          params: { symbol: symbols.join(',') },
          headers: { 'X-CMC_PRO_API_KEY': apiKey },
        },
      );

      for (const symbol of symbols) {
        const cryptoData = response.data.data[symbol];
        const normalizeSymbol = globalSymbols.coinmarketcap[symbol];
        prices[normalizeSymbol] = cryptoData.quote.USD.price;
      }
    } catch (error) {
      this.handleAxiosError(error, 'CoinMarketCap');
    }
    return prices;
  }

  async fetchFromBinance(
    symbols: string[],
  ): Promise<Record<string, number> | void> {
    try {
      const url = `https://api3.binance.com/api/v3/ticker/price?symbdols=["${symbols.join('","')}"]`;
      let prices = {};
      const { data } = await axios.get(url);
      for (const { price, symbol } of data) {
        const normalizeSymbol = globalSymbols.binance[symbol];
        prices[normalizeSymbol] = price;
      }

      return prices;
    } catch (e) {
      this.handleAxiosError(e, 'Binance');
    }
  }

  async fetchAllProviders() {
    const data = await Promise.allSettled([
      this.fetchFromCoinGecko(coingeckoSymbols),
      this.fetchFromCoinMarketCap(coinMarketCapSymbols),
      this.fetchFromBinance(binanceSymbols),
    ]);

    return data
      .filter((el) => el.status === 'fulfilled')
      .reduce(
        (acc, entry) => {
          for (const [key, value] of Object.entries(entry)) {
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(value);
          }
          return acc;
        },
        {} as Record<string, number[]>,
      );
  }
}
