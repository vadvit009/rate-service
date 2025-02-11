import { CreateAssetDto } from './create-asset.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
