import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorDetail, IAbstractError, InternalServerError } from '../errors';
import { SENTRY_TOKEN, SentryService } from '../services/sentry.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name);

  constructor(@Inject(SENTRY_TOKEN) private sentryService: SentryService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const type = host.getType();

    if (type === 'http') {
      const ctx = host.switchToHttp();
      const response: Response = ctx.getResponse();

      if (exception instanceof HttpException) {
        const status = exception?.getStatus();
        if (status >= 500) {
          this.sentryService.error(exception);
        }
        if (status >= 400 && status < 502) {
          const errors: ErrorDetail[] = this.instanceOfAbstractError(exception)
            ? exception.details
            : [{ field: '', message: exception.message }];
          response.status(status).json({ status, errors });
          return;
        }
        if (status === 503) {
          response.status(status).json(exception.getResponse());
          return;
        }
      }
    }
    let error;

    if (exception instanceof InternalServerError) {
      error = exception.details[0];
    } else {
      error =
        exception instanceof Error
          ? exception
          : new Error(JSON.stringify(exception));
    }
    this.logger.error(error.message);
  }

  private instanceOfAbstractError(object: any): object is IAbstractError {
    return typeof object === 'object' && object !== null && 'details' in object;
  }
}
