import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UfValidationPipe implements PipeTransform {
  transform(value: string) {
    if (value.length !== 2 || !/[a-zA-Z]/.test(value)) {
      throw new BadRequestException('A UF must have two letters');
    }

    value = value.toUpperCase();

    return value;
  }
}
