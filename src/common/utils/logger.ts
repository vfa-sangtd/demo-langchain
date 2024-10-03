import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * Process an error response and throw a custom exception
 *
 * @param error - The error object with a status and message
 */
export function processResponseError(error: any): never {
  switch (error.status) {
    case HttpStatus.BAD_REQUEST:
      throw new BadRequestException(error.message);
    case HttpStatus.FORBIDDEN:
      throw new ForbiddenException(error.message);
    case HttpStatus.UNAUTHORIZED:
      throw new ForbiddenException(error.message);
    default:
      throw new InternalServerErrorException(error.message);
  }
}

/**
 * Combines a message with an optional stack trace into a single string.
 *
 * @param message - The main message to be logged.
 * @param stack - An optional stack trace to be appended to the message.
 * @returns A combined string containing the message and stack trace (if provided).
 */
export function combineMessageLogger(message: string, stack?: string): string {
  const stackTrace = stack ? ` - ${stack}` : '';
  return `${message}${stackTrace}`;
}

/**
 * Simplifies an error stack trace by replacing newline characters with spaces.
 *
 * @param stack - The error stack trace to be simplified.
 * @returns A simplified string representation of the error stack trace.
 */
export function simplifyErrorStack(stack: string): string {
  return stack.replace(/\n/g, ' <--> ');
}
