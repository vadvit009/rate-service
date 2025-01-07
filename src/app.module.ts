import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateModule } from './rate/rate.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get('DATABASE_URL');
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
