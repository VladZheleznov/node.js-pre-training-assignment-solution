import { TrackRequestDurationInterceptor } from './track-request-duration.interceptor';

describe('TrackRequestDurationInterceptor', () => {
  it('should be defined', () => {
    expect(new TrackRequestDurationInterceptor()).toBeDefined();
  });
});
