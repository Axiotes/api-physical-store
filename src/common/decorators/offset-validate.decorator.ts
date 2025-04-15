import { SetMetadata } from '@nestjs/common';

export const OffsetValidated = (entity: Function) =>
  SetMetadata('offset_entity', entity);
