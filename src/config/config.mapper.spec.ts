/* eslint-disable @typescript-eslint/no-unused-vars */
import { configuration } from './config.mapper';

describe('Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should provide default configuration when no env variables are set', () => {
    process.env.NODE_ENV = 'production';
    const config = configuration();

    expect(config.environment).toBe('production');
    expect(config.adminJwt.secret).toBe('your-256-bit-secret');
    expect(config.adminJwt.tokenExpiration).toBe('30d');
    expect(config.timeTokenExpiration).toBe(15);
    expect(config.securedTokenExpiration).toBe(60);
  });

  it('should use environment variables when provided', () => {
    process.env.NODE_ENV = 'development';
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRATION_TIME = '1h';
    process.env.OTP_EXPIRATION_TIME = '30';
    process.env.TOKEN_EXPIRATION_TIME = '120';

    const config = configuration();

    expect(config.environment).toBe('development');
    expect(config.adminJwt.secret).toBe('test-secret');
    expect(config.adminJwt.tokenExpiration).toBe('1h');
    expect(config.timeTokenExpiration).toBe(30);
    expect(config.securedTokenExpiration).toBe(120);
  });

  it('should properly handle redis configuration', () => {
    process.env.REDIS_BULL_URL = 'redis://test:6379';
    process.env.REDIS_BULL_BACK_OFF = '10000';
    process.env.REDIS_BULL_ATTEMPTS = '3';

    const config = configuration();

    expect(config.bull.redis).toBe('redis://test:6379');
    expect(config.bull.defaultJobOptions.backoff).toBe(10000);
    expect(config.bull.defaultJobOptions.attempts).toBe(3);
  });

  it('should handle transport configuration', () => {
    process.env.TRANSPORT_REDIS_PORT = '6380';
    process.env.TRANSPORT_REDIS_HOST = 'test-host';

    const config = configuration();

    expect(config.transport.port).toBe(6380);
    expect(config.transport.host).toBe('test-host');
  });

  it('should handle cache configuration', () => {
    process.env.REDIS_CACHE_HOST = 'cache-host';
    process.env.REDIS_CACHE_PORT = '6381';
    process.env.REDIS_CACHE_PASSWORD = 'cache-pass';
    process.env.CACHE_TTL = '7200';

    const config = configuration();

    expect(config.cache.host).toBe('cache-host');
    expect(config.cache.port).toBe(6381);
    expect(config.cache.password).toBe('cache-pass');
    expect(config.cache.ttl).toBe(7200);
  });

  it('should handle reporting configuration', () => {
    process.env.PORT = '3335';
    process.env.PROJECT_GRAPHQL_PLAYGROUND = 'true';
    process.env.PROJECT_GRAPHQL_SUBSCRIPTIONS = 'true';
    process.env.PROJECT_DB_HOST = 'db-host';
    process.env.PROJECT_DB_PORT = '5433';

    const config = configuration();

    expect(config.reporting.port).toBe(3335);
    expect(config.reporting.graphqlPlayground).toBe(true);
    expect(config.reporting.graphqlSubscription).toBe(true);
    expect(config.reporting.database.host).toBe('db-host');
    expect(config.reporting.database.port).toBe(5433);
  });

  it('should handle JWT key configurations with newlines', () => {
    process.env.ADMIN_JWT_PUBLIC_KEY = 'key\\nwith\\nnewlines';
    process.env.JWT_PUBLIC_KEY = 'public\\nkey';
    process.env.JWT_PRIVATE_KEY = 'private\\nkey';

    const config = configuration();

    expect(config.adminJwt.publicKey).toBe('key\nwith\nnewlines');
    expect(config.jwt.publicKey).toBe('public\nkey');
    expect(config.jwt.privateKey).toBe('private\nkey');
  });
});
