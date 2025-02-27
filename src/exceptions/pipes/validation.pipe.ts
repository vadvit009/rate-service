import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import { BadRequestError, ErrorDetail } from '../errors';

export class ClassValidationPipe implements PipeTransform {
  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    if (metadata.type === 'query' || metadata.type === 'param') {
      return value;
    }
    const object = plainToInstance(metadata.metatype!, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestError(this.expandError(errors));
    }

    return object;
  }

  expandError(errors: ValidationError[]): ErrorDetail[] {
    const details: ErrorDetail[] = [];
    errors.forEach(({ property, children, constraints }) => {
      if (children) {
        this.expandError(children).forEach((error) => {
          details.push(error);
        });
      }
      if (constraints) {
        Object.keys(constraints).forEach((key) => {
          details.push({
            field: property,
            message: constraints[key].replace(property, '').trim(),
          });
        });
      }
    });
    return details;
  }
}
