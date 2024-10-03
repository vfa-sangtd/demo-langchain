import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { getErrorResponse } from '../../common/utils/common-function';
import { simplifyErrorStack } from '../../common/utils/logger';
import { GuardException } from './guard-exception';
import { Request, Response } from 'express';
import _ from 'lodash';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | GuardException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json(getErrorResponse(status, exception.message));

    // In case of GuardException
    if (exception instanceof GuardException) {
      let msg = `[${request.method} - ${request.url}] [FAILURE]`;
      msg += ` >>request: ${_.isEmpty(request) ? null : request}`;
      msg += ` >>response: ${response}`;
      msg += ` ${exception.message}`;

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        msg += ` >>detail: ${simplifyErrorStack(exception.stack)}`;
      }

      Logger.error(msg, undefined, ctx);
    }
  }
}
