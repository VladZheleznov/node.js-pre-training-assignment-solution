import { ActiveUserGuard } from './active-user.guard';

describe('ActiveUserGuard', () => {
  it('should be defined', () => {
    expect(new ActiveUserGuard()).toBeDefined();
  });
});
