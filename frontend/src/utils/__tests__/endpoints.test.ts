import { describe, it, expect } from 'vitest';
import { API_ENDPOINTS } from '../endpoints';

describe('API_ENDPOINTS', () => {
  it('should return correct static endpoints', () => {
    expect(API_ENDPOINTS.LOGIN).toBe('/api/auth/login');
    expect(API_ENDPOINTS.REGISTER).toBe('/api/auth/register');
  });

  it('should return correct dynamic endpoints with parameters', () => {
    expect(API_ENDPOINTS.RESEND_COOLDOWN('test@example.com')).toBe('/api/auth/resend-cooldown?email=test%40example.com');
    expect(API_ENDPOINTS.CUSTOM_PAGE('about-us')).toBe('/api/platform/custom-page/about-us');
    expect(API_ENDPOINTS.CHECKOUT_GATEWAYS(123)).toBe('/api/checkout/gateways/123');
    expect(API_ENDPOINTS.HISTORY_DETAILS('abc-123')).toBe('/api/history/abc-123');
    expect(API_ENDPOINTS.TICKET_DETAILS('t-456')).toBe('/api/tickets/t-456');
    expect(API_ENDPOINTS.TICKET_MESSAGE('t-456')).toBe('/api/tickets/t-456/message');
    expect(API_ENDPOINTS.BLOG_DETAILS('blog-789')).toBe('/api/blog/blog-789');
    expect(API_ENDPOINTS.BLOG_COMMENT('blog-789')).toBe('/api/blog/blog-789/comments');
    expect(API_ENDPOINTS.ESTIMATE_AVATAR('?param=val')).toBe('/api/video/estimate-avatar?param=val');
    expect(API_ENDPOINTS.VIDEO_STATUS('task-99')).toBe('/api/video/status/task-99');
  });
});
