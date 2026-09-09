import { Controller, Get, Query } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service.js';
import { MathService } from './math.service.js';

@Controller('math')
export class MathController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly mathService: MathService
  ) {}

  @Get('power')
  power(@Query('base') base: string, @Query('exponent') exponent: string) {
    const result = this.mathService.power(Number(base), Number(exponent));
    this.loggerService.log('Http request received from /math/power');
    return {
      base,
      exponent,
      result,
    };
  }
}
