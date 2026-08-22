import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  group('health check', () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, {
      'health returns 200': (r) => r.status === 200,
    });
  });

  group('openapi', () => {
    const res = http.get(`${BASE_URL}/openapi/v1.json`);
    check(res, {
      'openapi returns 200': (r) => r.status === 200,
    });
  });

  group('auth endpoints', () => {
    const payload = JSON.stringify({
      email: 'loadtest@nexclone.com',
      password: 'testpass123',
    });

    const loginRes = http.post(`${BASE_URL}/api/auth/login`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(loginRes, {
      'login returns 200 or 400': (r) => r.status === 200 || r.status === 400,
    });
  });

  group('public endpoints', () => {
    const res = http.get(`${BASE_URL}/`);
    check(res, {
      'home returns 2xx/3xx': (r) => r.status >= 200 && r.status < 400,
    });
  });

  sleep(1);
}

export function teardown() {
  console.log('Load test completed.');
}