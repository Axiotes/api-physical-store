import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CepValidationPipe implements PipeTransform {
  transform(value: string) {
    if (value.length !== 8) {
      throw new BadRequestException(`CEP must be 8 digits`);
    }

    if (/[a-zA-Z]/.test(value)) {
      throw new BadRequestException(`CEP must not have letters`);
    }

    return value;
  }
}
