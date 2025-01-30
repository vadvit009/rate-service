import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

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
}
