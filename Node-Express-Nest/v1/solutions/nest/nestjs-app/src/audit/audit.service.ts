import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { LoggerService } from '../logger/logger.service.js';

@Injectable()
export class AuditService {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService
  ) {}

  audit(userId: number): string {
    const user = this.userService.getUserById(userId);
    this.loggerService.log(`Audit: user with ID ${userId} verified`);
    return `Audit recorded for ${user}`;
  }
}
