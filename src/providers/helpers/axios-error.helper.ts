import { AxiosError, isAxiosError } from 'axios';
import { Logger } from '@nestjs/common';

export class AxiosErrorHelper {
  private readonly logger = new Logger(AxiosErrorHelper.name);

  public handleAxiosError(e: unknown, provider: string) {
    if (isAxiosError(e)) {
      const axiosError = e as AxiosError;
      const { url, method, headers } = axiosError.response.config;
      this.logger.error({
        error: axiosError.response.data,
        config: { url, method, headers },
        status: axiosError.response.status,
      });
    } else {
      this.logger.error(e, `Error in [${provider}]`);
    }
  }
}
