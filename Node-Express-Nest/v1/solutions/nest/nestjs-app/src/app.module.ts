import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerModule } from './logger/logger.module.js';
import { MathModule } from './math/math.module.js';
import { UserModule } from './user/user.module.js';
import { AuditModule } from './audit/audit.module.js';
import { TodoModule } from './todo-task/todo/todo.module.js';
import { TodoEntity } from './todo-task/entity/todo.entity.js';

@Module({
  imports: [
    LoggerModule,
    MathModule,
    UserModule,
    AuditModule,
    TodoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1111',
      database: 'todo_db',
      entities: [TodoEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
