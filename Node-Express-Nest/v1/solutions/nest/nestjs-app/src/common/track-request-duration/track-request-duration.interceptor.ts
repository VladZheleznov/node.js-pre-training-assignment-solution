import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../../logger/logger.service.js';

@Injectable()
export class TrackRequestDurationInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    this.loggerService.log('[2. Interceptor] Timer started');

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.loggerService.log(
          `[5. Interceptor] Request handled successfully in ${duration}ms`
        );
      })
    );
  }
}
