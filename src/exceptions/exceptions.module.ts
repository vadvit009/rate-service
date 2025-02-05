import { Module, DynamicModule } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core/constants';

import { HttpExceptionFilter } from './filters/exception.filter';
import { ClassValidationPipe } from './pipes/validation.pipe';
import { SENTRY_TOKEN, SentryService } from './services/sentry.service';

@Module({})
export class ExceptionsModule {
  static forRoot({
    includeValidationPipe = true,
    serverName,
  }: {
    includeValidationPipe?: boolean;
    serverName?: string;
  }): DynamicModule {
    const providers: any[] = [
      {
        provide: APP_FILTER,
        useClass: HttpExceptionFilter,
      },
      {
        provide: SENTRY_TOKEN,
        useFactory: () => new SentryService(serverName),
      },
    ];

    if (includeValidationPipe) {
      providers.push({
        provide: APP_PIPE,
        useClass: ClassValidationPipe,
      });
    }

    return {
      module: ExceptionsModule,
      providers,
      imports: [],
      exports: [
        {
          provide: SENTRY_TOKEN,
          useFactory: () => new SentryService(serverName),
        },
      ],
    };
  }
}
