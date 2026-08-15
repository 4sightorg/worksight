import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

export interface ErrorEnvelope {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
        error = exception.name.replace(/Exception$/, '') || 'Error';
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = (resObj.message as string | string[]) ?? exception.message;
        error = (resObj.error as string | undefined) ?? formatHttpStatusName(statusCode);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = 'Internal Server Error';
    }

    const path = request?.url ?? '';
    const timestamp = new Date().toISOString();

    const logMsg = `${request?.method ?? 'GET'} ${path} - ${statusCode} ${error}: ${
      Array.isArray(message) ? message.join(', ') : message
    }`;

    if (statusCode >= 500) {
      this.logger.error(logMsg, exception instanceof Error ? exception.stack : undefined);
    } else {
      this.logger.warn(logMsg);
    }

    const envelope: ErrorEnvelope = {
      statusCode,
      message,
      error,
      path,
      timestamp,
    };

    response.status(statusCode).json(envelope);
  }
}

function formatHttpStatusName(statusCode: number): string {
  const statusName = HttpStatus[statusCode];
  if (!statusName) return 'Error';
  return statusName
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}
