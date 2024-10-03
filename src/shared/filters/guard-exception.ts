import { HttpException } from '@nestjs/common';

export class GuardException extends HttpException {
  constructor(message: string | object | any, statusCode: number) {
    super(HttpException.createBody(null, message, statusCode), statusCode);
  }
}
