/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminAuthJwtStrategy } from './admin-jwt.strategy';
import { AccessTokenContext } from '../auth.interface';

describe('AdminAuthJwtStrategy', () => {
  let strategy: AdminAuthJwtStrategy;
  let configService: ConfigService;
  let queryBus: QueryBus;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockQueryBus = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    // Setup default mock for ConfigService
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'adminJwt') {
        return {
          secret: 'test-secret',
        };
      }
      return null;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAuthJwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    strategy = module.get<AdminAuthJwtStrategy>(AdminAuthJwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate admin user token with correct audience and issuer', async () => {
      const mockContext: AccessTokenContext = {
        sub: 'admin@example.com',
        aud: 'admin-user',
        iss: 'zurich-stuff',
      };

      const result = await strategy.validate(mockContext);

      expect(result).toEqual({
        token: mockContext,
        user: {
          id: mockContext.sub,
          role: 'Admin',
        },
        identity: 'ADMIN_USER',
      });
    });

    it('should throw BadRequestException for invalid audience', async () => {
      const mockContext: AccessTokenContext = {
        sub: 'admin@example.com',
        aud: 'user',
        iss: 'zurich-stuff',
      };

      await expect(strategy.validate(mockContext)).rejects.toThrow(
        new BadRequestException('Invalid audience'),
      );
    });

    it('should throw BadRequestException for invalid issuer', async () => {
      const mockContext: AccessTokenContext = {
        sub: 'admin@example.com',
        aud: 'admin-user',
        iss: 'invalid-issuer',
      };

      await expect(strategy.validate(mockContext)).rejects.toThrow(
        new BadRequestException('Invalid issuer, not allowed'),
      );
    });
  });
});
