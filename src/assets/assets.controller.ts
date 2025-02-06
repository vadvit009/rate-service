import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateAssetDto })
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiResponse({ type: CreateAssetDto, isArray: true })
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: CreateAssetDto })
  findOne(@Param('id') id: string) {
    return this.assetsService.findOneById(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: CreateAssetDto })
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(+id, updateAssetDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.assetsService.remove(+id);
    return { message: 'Asset removed successfully' };
  }
}
