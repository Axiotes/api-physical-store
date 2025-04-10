import { BadRequestException } from '@nestjs/common';
import { CepValidationPipe } from './cep-validation.pipe';

describe('CepValidationPipe', () => {
  it('should be defined', () => {
    expect(new CepValidationPipe()).toBeDefined();
  });

  it('should return the cep successfuly', () => {
    const value = "12345678";
    const pipe = new CepValidationPipe();

    const result = pipe.transform(value);

    expect(result).toBe(value);
  });

  it('should throw an error if the cep is bigger than 8', async () => {
    const value = "123456789";
    const pipe = new CepValidationPipe();

    await expect(() => pipe.transform(value)).toThrow(
      new BadRequestException(`CEP must be 8 digits`),
    );
  });

  it('should throw an error if the cep is smaller than 8', async () => {
    const value = "123456";
    const pipe = new CepValidationPipe();

    await expect(() => pipe.transform(value)).toThrow(
      new BadRequestException(`CEP must be 8 digits`),
    );
  });

  it('should throw an error if the cep contains letters', async () => {
    const value = "123456ab";
    const pipe = new CepValidationPipe();

    await expect(() => pipe.transform(value)).toThrow(
      new BadRequestException(`CEP must not have letters`),
    );
  });
});
