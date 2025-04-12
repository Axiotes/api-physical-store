import { CallHandler, ExecutionContext } from '@nestjs/common';
import { ErrorInterceptor } from './error.interceptor';
import { of, throwError } from 'rxjs';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;

  beforeEach(() => {
    interceptor = new ErrorInterceptor();
  });

  it('should be defined', () => {
    expect(new ErrorInterceptor()).toBeDefined();
  });

  it('should not return erros', (done) => {
    const context = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () => of('success'),
    };

    interceptor.intercept(context, callHandler).subscribe({
      next: (value) => {
        expect(value).toEqual('success');
        done();
      },
    });
  });

  it('should return error', (done) => {
    const context = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () => throwError(() => new Error('error')),
    };

    interceptor.intercept(context, callHandler).subscribe({
      next: () => fail('Should not emit the value'),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual('error');
        done();
      },
    });
  });
});
