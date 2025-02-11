import { globalSymbols } from '../../rate/consts/symbols.const';
import { Logger } from '@nestjs/common';

export enum ProvidersMode {
  ALL = 'ALL',
  CRYPTOCOM = 'CRYPTOCOM',
  COINGECKO = 'COINGECKO',
  COINMARKETCAP = 'COINMARKETCAP',
}

export type RateKeys = Record<keyof typeof globalSymbols.coinmarketcap, string>;

export interface ProviderService {
  fetchRates: (symbols: string[]) => Promise<RateKeys>;
  readonly providerKey?: string;
  readonly baseUrl: string;
  readonly logger: Logger;
}
