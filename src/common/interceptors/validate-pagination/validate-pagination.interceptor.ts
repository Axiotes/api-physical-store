import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ValidatePaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { limit, offset } = request.query;

    if (offset !== undefined && limit === undefined) {
      throw new BadRequestException(
        'The "limit" parameter must be provided when "offset" is used.',
      );
    }

    return next.handle();
  }
}
