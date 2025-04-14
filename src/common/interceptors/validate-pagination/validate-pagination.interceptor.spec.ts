import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { ValidatePaginationInterceptor } from './validate-pagination.interceptor';
import { of } from 'rxjs';

describe('ValidatePaginationInterceptor', () => {
  it('should be defined', () => {
    expect(new ValidatePaginationInterceptor()).toBeDefined();
  });

  it('should throw BadRequestException if offset is provided without limit', () => {
    const interceptor = new ValidatePaginationInterceptor();
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          query: {
            offset: 10,
            limit: undefined,
          },
        }),
      }),
    } as ExecutionContext;

    expect(() => interceptor.intercept(mockExecutionContext, null)).toThrow(
      BadRequestException,
    );
  });

  it('should not throw an exception if both offset and limit are provided', () => {
    const interceptor = new ValidatePaginationInterceptor();
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          query: {
            offset: 10,
            limit: 5,
          },
        }),
      }),
    } as ExecutionContext;

    const callHandler: CallHandler = {
      handle: () => of(),
    };
    interceptor
      .intercept(mockExecutionContext, callHandler)
      .subscribe((value) => {
        expect(value).toBeUndefined();
      });
  });

  it('should not throw an exception if only limit is provided', () => {
    const interceptor = new ValidatePaginationInterceptor();
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          query: {
            offset: undefined,
            limit: 10,
          },
        }),
      }),
    } as ExecutionContext;

    const callHandler: CallHandler = {
      handle: () => of(),
    };
    interceptor
      .intercept(mockExecutionContext, callHandler)
      .subscribe((value) => {
        expect(value).toBeUndefined();
      });
  });

  it('should not throw an exception if neither offset nor limit are provided', () => {
    const interceptor = new ValidatePaginationInterceptor();
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          query: {
            offset: undefined,
            limit: undefined,
          },
        }),
      }),
    } as ExecutionContext;

    const callHandler: CallHandler = {
      handle: () => of(),
    };
    interceptor
      .intercept(mockExecutionContext, callHandler)
      .subscribe((value) => {
        expect(value).toBeUndefined();
      });
  });
});
