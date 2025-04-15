import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { ValidatePaginationInterceptor } from './validate-pagination.interceptor';
import { of } from 'rxjs';
import { DataSource } from 'typeorm';
import { Reflector } from '@nestjs/core';

describe('ValidatePaginationInterceptor', () => {
  it('should be defined', () => {
    const mockReflector = {
      get: jest.fn().mockReturnValue('MockEntity'),
    } as Partial<Reflector>;

    const mockRepo = {
      count: jest.fn().mockResolvedValue(100),
    };

    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepo),
    } as Partial<DataSource>;

    expect(
      new ValidatePaginationInterceptor(
        mockReflector as Reflector,
        mockDataSource as DataSource,
      ),
    ).toBeDefined();
  });

  it('should throw BadRequestException if offset is provided without limit', async () => {
    const mockReflector = {
      get: jest.fn().mockReturnValue('MockEntity'),
    } as Partial<Reflector>;

    const mockRepo = {
      count: jest.fn().mockResolvedValue(100),
    };

    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepo),
    } as Partial<DataSource>;

    const interceptor = new ValidatePaginationInterceptor(
      mockReflector as Reflector,
      mockDataSource as DataSource,
    );
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          query: {
            offset: 10,
            limit: undefined,
          },
        }),
      }),
      getClass: () => class {},
    } as ExecutionContext;

    await expect(() =>
      interceptor.intercept(mockExecutionContext, null),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not throw an exception if both offset and limit are provided', async () => {
    const mockReflector = {
      get: jest.fn().mockReturnValue('MockEntity'),
    } as Partial<Reflector>;

    const mockRepo = {
      count: jest.fn().mockResolvedValue(100),
    };

    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepo),
    } as Partial<DataSource>;

    const interceptor = new ValidatePaginationInterceptor(
      mockReflector as Reflector,
      mockDataSource as DataSource,
    );
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          query: {
            offset: 10,
            limit: 5,
          },
        }),
      }),
      getClass: () => class {},
    } as ExecutionContext;

    const callHandler: CallHandler = {
      handle: () => of(),
    };
    const observable = await interceptor.intercept(
      mockExecutionContext,
      callHandler,
    );
    observable.subscribe((value) => {
      expect(value).toBeUndefined();
    });
  });

  it('should not throw an exception if only limit is provided', async () => {
    const mockReflector = {
      get: jest.fn().mockReturnValue('MockEntity'),
    } as Partial<Reflector>;

    const mockRepo = {
      count: jest.fn().mockResolvedValue(100),
    };

    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepo),
    } as Partial<DataSource>;

    const interceptor = new ValidatePaginationInterceptor(
      mockReflector as Reflector,
      mockDataSource as DataSource,
    );
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          query: {
            offset: undefined,
            limit: 10,
          },
        }),
      }),
      getClass: () => class {},
    } as ExecutionContext;

    const callHandler: CallHandler = {
      handle: () => of(),
    };
    const observable = await interceptor.intercept(
      mockExecutionContext,
      callHandler,
    );
    observable.subscribe((value) => {
      expect(value).toBeUndefined();
    });
  });

  it('should not throw an exception if neither offset nor limit are provided', async () => {
    const mockReflector = {
      get: jest.fn().mockReturnValue('MockEntity'),
    } as Partial<Reflector>;

    const mockRepo = {
      count: jest.fn().mockResolvedValue(100),
    };

    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepo),
    } as Partial<DataSource>;

    const interceptor = new ValidatePaginationInterceptor(
      mockReflector as Reflector,
      mockDataSource as DataSource,
    );
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          query: {
            offset: undefined,
            limit: undefined,
          },
        }),
      }),
      getClass: () => class {},
    } as ExecutionContext;

    const callHandler: CallHandler = {
      handle: () => of(),
    };
    const observable = await interceptor.intercept(
      mockExecutionContext,
      callHandler,
    );

    observable.subscribe((value) => {
      expect(value).toBeUndefined();
    });
  });

  it('should throw BadRequestException if offset exceeds total records', async () => {
    const mockReflector = {
      get: jest.fn().mockReturnValue('MockEntity'),
    } as Partial<Reflector>;

    const mockRepo = {
      count: jest.fn().mockResolvedValue(15),
    };

    const mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepo),
    } as Partial<DataSource>;

    const interceptor = new ValidatePaginationInterceptor(
      mockReflector as Reflector,
      mockDataSource as DataSource,
    );

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          query: {
            offset: 20,
            limit: 5,
          },
        }),
      }),
      getClass: () => class {},
    } as ExecutionContext;

    const callHandler: CallHandler = {
      handle: () => of(),
    };

    await expect(() =>
      interceptor.intercept(mockExecutionContext, callHandler),
    ).rejects.toThrow(BadRequestException);
  });
});
