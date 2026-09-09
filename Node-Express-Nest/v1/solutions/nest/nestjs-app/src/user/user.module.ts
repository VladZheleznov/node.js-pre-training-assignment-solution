import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module.js';
import { UserService } from './user.service.js';

@Module({
  imports: [LoggerModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
