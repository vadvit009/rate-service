import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, isAxiosError } from 'axios';
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

  async fetchFromCoinGecko(symbols: string[]): Promise<Record<string, number>> {
    try {
      const ids = symbols.join(',');
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
      const { data } = await axios.get(url);

      const result: Record<string, number> = {};
      Object.entries(data).forEach(([coinId, coinData]) => {
        const normalizeSymbol = globalSymbols.coingecko[coinId];
        result[normalizeSymbol] = (coinData as any).usd;
      });

      return result;
    } catch (error) {
      this.logger.error('CoinGecko fetch error', error);
      throw new BadGatewayException('Failed to fetch data from CoinGecko');
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
      this.logger.error(`Error fetching ${symbols.join(',')} price:`, error);
    }
    return prices;
  }

  async fetchFromBinance(symbols: string[]): Promise<Record<string, number>> {
    try {
      const url = `https://api3.binance.com/api/v3/ticker/price?symbols=["${symbols.join('","')}"]`;
      let prices = {};
      const { data } = await axios.get(url);
      for (const { price, symbol } of data) {
        const normalizeSymbol = globalSymbols.binance[symbol];
        prices[normalizeSymbol] = price;
      }

      return prices;
    } catch (e) {
      if (isAxiosError(e)) {
        const axiosError = e as AxiosError;
        this.logger.error(
          {
            err: axiosError.response.data,
            u: axiosError.response.config,
          },
          'axios binance error',
        );
      } else {
        this.logger.error(e, 'binance fetch error');
      }
    }
  }

  async fetchAllProviders() {
    const data = await Promise.all([
      this.fetchFromCoinGecko(coingeckoSymbols),
      this.fetchFromCoinMarketCap(coinMarketCapSymbols),
      this.fetchFromBinance(binanceSymbols),
    ]);

    return data.reduce(
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
