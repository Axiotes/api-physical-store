import { LoggerService } from 'src/common/utils/logger/logger.service';
import { LoggerInterceptor } from './logger.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggerInterceptor', () => {
  let interceptor: LoggerInterceptor;
  let loggerService: LoggerService;

  beforeEach(() => {
    loggerService = { logInfo: jest.fn() } as any;
    interceptor = new LoggerInterceptor(loggerService);
    loggerService.logInfo = jest.fn();
  });

  const mockContext: ExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        method: 'GET',
        url: '/test',
        params: { cep: '00000000' },
        body: {},
      }),
      getResponse: () => ({
        statusCode: 200,
      }),
    }),
  } as any;

  it('should be defined', () => {
    expect(new LoggerInterceptor(loggerService)).toBeDefined();
  });

  it('should log request info with execution time', (done) => {
    const callHandler: CallHandler = {
      handle: () => of('response'),
    };

    interceptor.intercept(mockContext, callHandler).subscribe((response) => {
      expect(response).toEqual('response');
      done();
    });
  });
});
