import { Module } from '@nestjs/common';
import { MathController } from './math.controller.js';
import { MathService } from './math.service.js';
import { LoggerModule } from '../logger/logger.module.js';

@Module({
  imports: [LoggerModule],
  controllers: [MathController],
  providers: [MathService],
})
export class MathModule {}
