import { NotFoundException } from '@nestjs/common';

import { ErrorDetail, IAbstractError } from './abstract.error';

const defaultError = [
  {
    field: '',
    message: 'Not Found',
  },
];

export class NotFoundError extends NotFoundException implements IAbstractError {
  private readonly pDetails: ErrorDetail[] = [];

  constructor(details: ErrorDetail[] = defaultError) {
    super();

    this.pDetails = details;
  }

  get details(): ErrorDetail[] {
    return this.pDetails;
  }
}
