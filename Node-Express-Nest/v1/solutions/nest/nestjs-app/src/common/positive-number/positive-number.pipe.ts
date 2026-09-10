import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service.js';

@Injectable()
export class PositiveNumberPipe implements PipeTransform {
  constructor(private readonly loggerService: LoggerService) {}
  transform(value: any, metadata: ArgumentMetadata) {
    this.loggerService.log('[3. Pipe] Parsing value');
    const val = parseInt(value, 10);

    if (isNaN(val) || val <= 0) {
      throw new BadRequestException(
        `The parameter ${metadata.data} must be a positive number`
      );
    }
    return value;
  }
}
