import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiCreatedResponse({ type: Asset })
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiResponse({ type: Asset, isArray: true })
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: Asset })
  findOne(@Param('id') id: string) {
    return this.assetsService.findOneById(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: Asset })
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(+id, updateAssetDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.assetsService.remove(+id);
    return { message: 'Asset removed successfully' };
  }
}
