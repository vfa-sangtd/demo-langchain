import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const className = context.getClass().name;

    if (req) {
      const method = req.method;
      const url = req.url;
      return next.handle().pipe(
        tap({
          complete: () => {
            const elapsedTime = Date.now() - now;
            Logger.log(
              `[SUCCESS][${elapsedTime}ms] - Method: ${method}, URL: ${url}`,
              className,
            );
          },
          error: () => {
            const elapsedTime = Date.now() - now;
            Logger.error(
              `[ERROR][${elapsedTime}ms] - Method: ${method}, URL: ${url}`,
              undefined,
              className,
            );
          },
        }),
      );
    } else {
      return next.handle().pipe(
        tap({
          complete: () => {
            const elapsedTime = Date.now() - now;
            Logger.log(`[SUCCESS][${elapsedTime}ms]`, className);
          },
          error: (err: any) => {
            const elapsedTime = Date.now() - now;
            Logger.error(`[ERROR][${elapsedTime}ms]`, err, className);
          },
        }),
      );
    }
  }
}
