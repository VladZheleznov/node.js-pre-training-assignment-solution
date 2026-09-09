import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [LoggerService]: ${message}`);
  }
}
