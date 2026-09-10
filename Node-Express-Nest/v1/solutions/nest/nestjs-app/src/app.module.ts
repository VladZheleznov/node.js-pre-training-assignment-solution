import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerModule } from './logger/logger.module.js';
import { MathModule } from './math/math.module.js';
import { UserModule } from './user/user.module.js';
import { AuditModule } from './audit/audit.module.js';
import { TodoModule } from './todo-task/todo/todo.module.js';

@Module({
  imports: [LoggerModule, MathModule, UserModule, AuditModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
