import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { globalSymbols } from '../rate/consts/symbols.const';

@Injectable()
export class AssetsService implements OnModuleInit {
  private readonly logger = new Logger(AssetsService.name);

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async onModuleInit() {
    this.logger.debug('AssetsService initializing');
    const data = await this.findAll();
    if (!data.length) {
      await this.seed();
    }
    this.logger.debug('AssetsService initialized');
  }

  create(createAssetDto: CreateAssetDto) {
    return this.assetRepository.insert(createAssetDto);
  }

  findAll() {
    return this.assetRepository.find();
  }

  findOneById(id: number) {
    return this.assetRepository.findOne({ where: { id } });
  }

  findOne(field: FindOptionsWhere<Asset>) {
    return this.assetRepository.findOneBy(field);
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return this.assetRepository.update(id, updateAssetDto);
  }

  remove(id: number) {
    return this.assetRepository.delete(id);
  }

  async seed() {
    const crypto: Omit<Asset, 'id'>[] = Object.entries(
      globalSymbols.coingecko,
    ).map(([a, b]) => {
      return { symbol: b, name: a, type: 'crypto' };
    });
    const fiat: Omit<Asset, 'id'>[] = [
      {
        symbol: 'AED',
        name: 'AED',
        type: 'fiat',
      },
      {
        symbol: 'ARS',
        name: 'ARS',
        type: 'fiat',
      },
      {
        symbol: 'AUD',
        name: 'AUD',
        type: 'fiat',
      },
      {
        symbol: 'AZN',
        name: 'AZN',
        type: 'fiat',
      },
      {
        symbol: 'BGN',
        name: 'BGN',
        type: 'fiat',
      },
      {
        symbol: 'BHD',
        name: 'BHD',
        type: 'fiat',
      },
      {
        symbol: 'BRL',
        name: 'BRL',
        type: 'fiat',
      },
      {
        symbol: 'CAD',
        name: 'CAD',
        type: 'fiat',
      },
      {
        symbol: 'CHF',
        name: 'CHF',
        type: 'fiat',
      },
      {
        symbol: 'CLP',
        name: 'CLP',
        type: 'fiat',
      },
      {
        symbol: 'COP',
        name: 'COP',
        type: 'fiat',
      },
      {
        symbol: 'CRC',
        name: 'CRC',
        type: 'fiat',
      },
      {
        symbol: 'CZK',
        name: 'CZK',
        type: 'fiat',
      },
      {
        symbol: 'DKK',
        name: 'DKK',
        type: 'fiat',
      },
      {
        symbol: 'DOP',
        name: 'DOP',
        type: 'fiat',
      },
      {
        symbol: 'EUR',
        name: 'EUR',
        type: 'fiat',
      },
      {
        symbol: 'GBP',
        name: 'GBP',
        type: 'fiat',
      },
      {
        symbol: 'GEL',
        name: 'GEL',
        type: 'fiat',
      },
      {
        symbol: 'GTQ',
        name: 'GTQ',
        type: 'fiat',
      },
      {
        symbol: 'HKD',
        name: 'HKD',
        type: 'fiat',
      },
      {
        symbol: 'HNL',
        name: 'HNL',
        type: 'fiat',
      },
      {
        symbol: 'HRK',
        name: 'HRK',
        type: 'fiat',
      },
      {
        symbol: 'HUF',
        name: 'HUF',
        type: 'fiat',
      },
      {
        symbol: 'IDR',
        name: 'IDR',
        type: 'fiat',
      },
      {
        symbol: 'ILS',
        name: 'ILS',
        type: 'fiat',
      },
      {
        symbol: 'INR',
        name: 'INR',
        type: 'fiat',
      },
      {
        symbol: 'JPY',
        name: 'JPY',
        type: 'fiat',
      },
      {
        symbol: 'KRW',
        name: 'KRW',
        type: 'fiat',
      },
      {
        symbol: 'KWD',
        name: 'KWD',
        type: 'fiat',
      },
      {
        symbol: 'MDL',
        name: 'MDL',
        type: 'fiat',
      },
      {
        symbol: 'MXN',
        name: 'MXN',
        type: 'fiat',
      },
      {
        symbol: 'MYR',
        name: 'MYR',
        type: 'fiat',
      },
      {
        symbol: 'NOK',
        name: 'NOK',
        type: 'fiat',
      },
      {
        symbol: 'NZD',
        name: 'NZD',
        type: 'fiat',
      },
      {
        symbol: 'OMR',
        name: 'OMR',
        type: 'fiat',
      },
      {
        symbol: 'PEN',
        name: 'PEN',
        type: 'fiat',
      },
      {
        symbol: 'PHP',
        name: 'PHP',
        type: 'fiat',
      },
      {
        symbol: 'PLN',
        name: 'PLN',
        type: 'fiat',
      },
      {
        symbol: 'PYG',
        name: 'PYG',
        type: 'fiat',
      },
      {
        symbol: 'QAR',
        name: 'QAR',
        type: 'fiat',
      },
      {
        symbol: 'RON',
        name: 'RON',
        type: 'fiat',
      },
      {
        symbol: 'RWF',
        name: 'RWF',
        type: 'fiat',
      },
      {
        symbol: 'SAR',
        name: 'SAR',
        type: 'fiat',
      },
      {
        symbol: 'SEK',
        name: 'SEK',
        type: 'fiat',
      },
      {
        symbol: 'THB',
        name: 'THB',
        type: 'fiat',
      },
      {
        symbol: 'TRY',
        name: 'TRY',
        type: 'fiat',
      },
      {
        symbol: 'TWD',
        name: 'TWD',
        type: 'fiat',
      },
      {
        symbol: 'USD',
        name: 'USD',
        type: 'fiat',
      },
      {
        symbol: 'UYU',
        name: 'UYU',
        type: 'fiat',
      },
      {
        symbol: 'VND',
        name: 'VND',
        type: 'fiat',
      },
      {
        symbol: 'ZAR',
        name: 'ZAR',
        type: 'fiat',
      },
    ];

    await this.assetRepository.insert([...crypto, ...fiat]);
  }
}
