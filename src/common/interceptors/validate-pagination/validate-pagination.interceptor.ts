import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class ValidatePaginationInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const entity = this.reflector.get('offset_entity', context.getClass());
    const request = context.switchToHttp().getRequest();
    const { limit, offset } = request.query;

    if (offset !== undefined && limit === undefined) {
      throw new BadRequestException(
        'The "limit" parameter must be provided when "offset" is used.',
      );
    }

    const repository = this.dataSource.getRepository(entity);
    const total = await repository.count();

    if (offset >= total) {
      throw new BadRequestException(
        `Offset ${offset} exceeds total records (${total})`,
      );
    }

    return next.handle();
  }
}
