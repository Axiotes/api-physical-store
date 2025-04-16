import { BadRequestException } from '@nestjs/common';
import { UfValidationPipe } from './uf-validation.pipe';

describe('UfValidationPipe', () => {
  it('should be defined', () => {
    expect(new UfValidationPipe()).toBeDefined();
  });

  it('should return uf successfuly', () => {
    const uf = 'PE';

    const pipe = new UfValidationPipe();

    const result = pipe.transform(uf);

    expect(result).toEqual(uf);
  });

  it('should throw BadRequestExeption if UF has more than 2 letters', () => {
    const uf = 'Pernambuco';

    const pipe = new UfValidationPipe();

    expect(() => pipe.transform(uf)).toThrow(
      new BadRequestException('A UF must have two letters'),
    );
  });

  it('should throw BadRequestExeption if UF has less than 2 letters', () => {
    const uf = 'P';

    const pipe = new UfValidationPipe();

    expect(() => pipe.transform(uf)).toThrow(
      new BadRequestException('A UF must have two letters'),
    );
  });

  it('should throw BadRequestExeption if UF has numbers', () => {
    const uf = '12';

    const pipe = new UfValidationPipe();

    expect(() => pipe.transform(uf)).toThrow(
      new BadRequestException('A UF must have two letters'),
    );
  });
});
