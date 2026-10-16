import { RequestLoggingMiddleware } from './request-logging.middleware.js';

describe('RequestLoggingMiddleware', () => {
  it('should be defined', () => {
    expect(new RequestLoggingMiddleware()).toBeDefined();
  });
});
