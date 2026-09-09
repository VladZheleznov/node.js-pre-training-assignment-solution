import { Module } from '@nestjs/common';
import { AuditService } from './audit.service.js';
import { LoggerModule } from '../logger/logger.module.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [LoggerModule, UserModule],
  providers: [AuditService],
  exports: [AuditModule],
})
export class AuditModule {}
