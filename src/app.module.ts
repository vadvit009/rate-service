import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateModule } from './rate/rate.module';
import { SocketModule } from './socket/socket.module';
import { RedisModule } from './redis/redis.module';
import { ConvertModule } from './convert/convert.module';
import { AssetsModule } from './assets/assets.module';
import { ExceptionsModule } from './exceptions';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url,
          logging: true,
          synchronize: true,
          autoLoadEntities: true,
          schema: 'paypilot',
          debug: true,
        };
      },
    }),
    RateModule,
    SocketModule,
    RedisModule,
    ConvertModule,
    AssetsModule,
    ExceptionsModule.forRoot({
      includeValidationPipe: true,
      serverName: 'Rate',
    }),
    ProvidersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
