import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service.js';

@Injectable()
export class MathService {
  constructor(private readonly loggerService: LoggerService) {}

  power(base: number, exponent: number): number {
    this.loggerService.log(`Executing calculation: ${base} ^ ${exponent}`);
    return Math.pow(base, exponent);
  }
}
