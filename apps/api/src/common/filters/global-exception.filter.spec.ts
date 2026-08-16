import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
  });

  function createMockArgumentsHost() {
    const jsonFn = jest.fn();
    const statusFn = jest.fn().mockReturnValue({ json: jsonFn });

    const response = { status: statusFn };
    const request = { method: 'GET', url: '/test-url' };

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as unknown as ArgumentsHost;

    return { host, statusFn, jsonFn };
  }

  it('formats HttpException into standard error envelope', () => {
    const { host, statusFn, jsonFn } = createMockArgumentsHost();
    const exception = new BadRequestException('Invalid payload');

    filter.catch(exception, host);

    expect(statusFn).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(jsonFn).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Invalid payload',
        error: 'Bad Request',
        path: '/test-url',
        timestamp: expect.any(String),
      })
    );
  });

  it('formats non-HttpException (e.g. raw Error) into 500 error envelope', () => {
    const { host, statusFn, jsonFn } = createMockArgumentsHost();
    const exception = new Error('Database connection failed');

    filter.catch(exception, host);

    expect(statusFn).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(jsonFn).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Database connection failed',
        error: 'Internal Server Error',
        path: '/test-url',
        timestamp: expect.any(String),
      })
    );
  });
});
