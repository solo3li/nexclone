import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import api from '../api';
import axios from 'axios';

vi.mock('axios', () => {
  const requestUse = vi.fn();
  const responseUse = vi.fn();
  const createMock = vi.fn().mockReturnValue({
    interceptors: {
      request: { use: requestUse },
      response: { use: responseUse },
    },
  });
  return {
    default: {
      create: createMock,
    }
  };
});

describe('api axios instance', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://test-url:1234');
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should create axios instance with correct defaults', async () => {
    await import('../api');
    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: expect.any(String),
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    }));
  });
});

describe('api interceptors', () => {
  let requestInterceptor: Function;
  let responseInterceptorError: Function;
  let responseInterceptorSuccess: Function;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    const mockInstance = {
      interceptors: {
        request: { use: vi.fn((success, error) => { requestInterceptor = success; }) },
        response: { use: vi.fn((success, error) => { 
          responseInterceptorSuccess = success;
          responseInterceptorError = error; 
        }) },
      },
    };
    (axios.create as Mock).mockReturnValue(mockInstance);

    await import('../api');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should add authorization header if token exists in localStorage', () => {
    const mockGetItem = vi.fn().mockReturnValue('fake-token');
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', { getItem: mockGetItem });

    const config = { headers: {} };
    const result = requestInterceptor(config);

    expect(mockGetItem).toHaveBeenCalledWith('jwt_token');
    expect(result.headers.Authorization).toBe('Bearer fake-token');
  });

  it('should not add authorization header if token does not exist', () => {
    const mockGetItem = vi.fn().mockReturnValue(null);
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', { getItem: mockGetItem });

    const config = { headers: {} };
    const result = requestInterceptor(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should handle 401 unauthorized response and redirect', () => {
    const mockRemoveItem = vi.fn();
    vi.stubGlobal('window', { location: { pathname: '/dashboard', href: '' } });
    vi.stubGlobal('localStorage', { removeItem: mockRemoveItem });
    vi.stubGlobal('document', { documentElement: { lang: 'en' } });

    const error = {
      response: { status: 401 },
      config: { url: '/api/some-secure-endpoint' },
    };

    expect(responseInterceptorError(error)).rejects.toEqual(error);

    expect(mockRemoveItem).toHaveBeenCalledWith('jwt_token');
    expect(window.location.href).toBe('/en/login');
  });

  it('should not redirect on 401 if URL is auth-related', () => {
    const mockRemoveItem = vi.fn();
    vi.stubGlobal('window', { location: { pathname: '/en/login', href: '' } });
    vi.stubGlobal('localStorage', { removeItem: mockRemoveItem });

    const error = {
      response: { status: 401 },
      config: { url: '/api/auth/login' },
    };

    expect(responseInterceptorError(error)).rejects.toEqual(error);
    expect(mockRemoveItem).not.toHaveBeenCalled();
  });
});
