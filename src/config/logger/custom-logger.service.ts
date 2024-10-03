import { ConsoleLogger } from '@nestjs/common';
import {
  combineMessageLogger,
  simplifyErrorStack,
} from '../../common/utils/logger';

export class CustomLogger extends ConsoleLogger {
  warn(message: any, context?: string): void {
    let msg = message;
    if (typeof msg === 'object') {
      msg = message.message + ' ' + simplifyErrorStack(message.stack);
    }
    super.warn(msg, context);
  }

  error(message: string, stack?: string, context?: string): void {
    const msg: string = combineMessageLogger(message, stack);
    super.error(msg, undefined, context);
  }
}
