import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service.js';
import { LoggerService } from '../logger/logger.service.js';

describe('UserService', () => {
  let service: UserService;

  const mockLoggerService = {
    log: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: LoggerService, useValue: mockLoggerService }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct user string and log', () => {
    const result = service.getUserById(12);

    expect(result).toBe('User_12');
    expect(mockLoggerService.log).toHaveBeenCalled();
  });
});
