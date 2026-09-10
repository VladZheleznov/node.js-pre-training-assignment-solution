import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';

@Module({
  imports: [LoggerModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
