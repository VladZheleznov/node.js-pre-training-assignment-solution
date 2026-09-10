import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service.js';
import { LoggerService } from '../logger/logger.service.js';
import { ActiveUserGuard } from '../common/active-user/active-user.guard.js';
import { TrackRequestDurationInterceptor } from '../common/track-request-duration/track-request-duration.interceptor.js';
import { PositiveNumberPipe } from '../common/positive-number/positive-number.pipe.js';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService
  ) {}

  @Get(':id')
  @UseGuards(ActiveUserGuard)
  @UseInterceptors(TrackRequestDurationInterceptor)
  getUserById(@Param('id', PositiveNumberPipe) id: number) {
    this.loggerService.log('[4. Controller] Core route logic');
    return this.userService.getUserById(id);
  }
}
