import { CallHandler, ExecutionContext } from '@nestjs/common';
import { ErrorInterceptor } from './error.interceptor';
import { of, throwError } from 'rxjs';
import { LoggerService } from 'src/common/utils/logger/logger.service';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let loggerService: LoggerService;

  beforeEach(() => {
    loggerService = { logInfo: jest.fn() } as any;
    interceptor = new ErrorInterceptor(loggerService);
    loggerService.logError = jest.fn();
  });

  const mockContext: ExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        method: 'GET',
        url: '/test',
        params: {},
        body: {},
      }),
      getResponse: () => ({
        statusCode: 500,
      }),
    }),
  } as any;

  it('should be defined', () => {
    expect(new ErrorInterceptor(loggerService)).toBeDefined();
  });

  it('should not return erros', (done) => {
    const callHandler: CallHandler = {
      handle: () => of('success'),
    };

    interceptor.intercept(mockContext, callHandler).subscribe({
      next: (value) => {
        expect(value).toEqual('success');
        done();
      },
    });
  });

  it('should return error', (done) => {
    const callHandler: CallHandler = {
      handle: () => throwError(() => new Error('error')),
    };

    interceptor.intercept(mockContext, callHandler).subscribe({
      next: () => fail('Should not emit the value'),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual('error');
        done();
      },
    });
  });
});
