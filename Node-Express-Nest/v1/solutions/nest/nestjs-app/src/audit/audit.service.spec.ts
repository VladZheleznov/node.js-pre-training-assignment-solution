import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service.js';
import { UserService } from '../user/user.service.js';
import { LoggerService } from '../logger/logger.service.js';

describe('AuditService', () => {
  let service: AuditService;

  const mockUserService = {
    getUserById: vi.fn().mockReturnValue('TestUser_12'),
  };

  const mockLoggerService = {
    log: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: UserService, useValue: mockUserService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should record audit, use UserService and use LoggerService', () => {
    const result = service.audit(12);

    expect(mockUserService.getUserById).toHaveBeenCalledWith(12);
    expect(mockLoggerService.log).toHaveBeenCalled();
    expect(result).toBe('Audit recorded for TestUser_12');
  });
});
