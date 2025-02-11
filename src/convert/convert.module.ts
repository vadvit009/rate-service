import { Module } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ConvertController } from './convert.controller';
import { RateModule } from '../rate/rate.module';
import { AssetsModule } from '../assets/assets.module';
import { RedisModule } from '../redis/redis.module';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [RateModule, AssetsModule, RedisModule, ProvidersModule],
  controllers: [ConvertController],
  providers: [ConvertService],
})
export class ConvertModule {}
