import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service.js';

@Injectable()
export class UserService {
  constructor(private readonly loggerService: LoggerService) {}

  getUserById(id: number): string {
    this.loggerService.log(`Fetching user with id ${id}`);
    return `User_${id}`;
  }
}
