import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../../logger/logger.service.js';

@Injectable()
export class ActiveUserGuard implements CanActivate {
  constructor(private readonly loggerService: LoggerService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.loggerService.log('[1. Guard] checking user status from headers');
    const request = context.switchToHttp().getRequest();
    const userStatus = request.headers['x-user-status'];

    if (userStatus === 'banned') {
      this.loggerService.log('[1. Guard] Access blocked: user is blacklisted');
      throw new ForbiddenException('Access denied: your account is blocked');
    }

    this.loggerService.log('[1. Guard] Access granted!');
    return true;
  }
}
