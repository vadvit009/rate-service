import { Injectable, Logger } from '@nestjs/common';
import {
  captureException,
  captureMessage,
  init,
  setTag,
  withScope,
  SeverityLevel,
} from '@sentry/nestjs';
import { SENTRY } from '../../config/sentry.config';

export const SENTRY_TOKEN = 'SENTRY_TOKEN';

@Injectable()
export class SentryService {
  private installed = false;
  private logger = new Logger(SentryService.name);
  private serverName = '';

  constructor(serverName: string) {
    this.serverName = serverName;

    if (!SENTRY.ENABLED) {
      this.logger.warn('Sentry is disabled');
      return;
    }

    this.install();
  }

  private install(): void {
    init({
      dsn: SENTRY.DSN,
      serverName: this.serverName,
    });

    setTag('process', this.serverName);
    withScope((scope) => {
      scope.addEventProcessor((event) => {
        if (event?.exception?.values) {
          event.exception.values.forEach((v) => {
            v.type = `[${this.serverName}] ${v.type}`;
          });
        }
        return event;
      });
    });

    this.installed = true;
    this.logger.log('Sentry installed successfully');
  }

  warning(message: string): void {
    this.logAndSendToSentry(message, 'warning');
  }

  message(message: string): void {
    this.logAndSendToSentry(message, 'info');
  }

  error(error: Error): Error {
    const errorMessage = error.stack || error.message || 'Unknown error';
    this.logger.error(errorMessage);

    if (this.installed) {
      captureException(error);
    }

    return error;
  }

  private logAndSendToSentry(message: string, level: SeverityLevel): void {
    this.logger.log(message, level);

    if (this.installed) {
      captureMessage(message, level);
    }
  }
}
