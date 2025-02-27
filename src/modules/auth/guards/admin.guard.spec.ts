/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminAuthJwtGuard } from './admin.guard';

describe('AdminAuthJwtGuard', () => {
  let guard: AdminAuthJwtGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAuthJwtGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    guard = module.get<AdminAuthJwtGuard>(AdminAuthJwtGuard);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockContext: ExecutionContext;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        headers: {},
      };

      mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getType: jest.fn(),
        getArgs: jest.fn(),
      } as unknown as ExecutionContext;
    });

    it('should throw UnauthorizedException when no authorization header', async () => {
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('No authorization header'),
      );
    });

    it('should throw UnauthorizedException for invalid token type', async () => {
      mockRequest.headers.authorization = 'Basic token';
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('Invalid token type'),
      );
    });

    it('should throw UnauthorizedException when JWT config is missing', async () => {
      mockRequest.headers.authorization = 'Bearer token';
      mockConfigService.get.mockImplementation((key) => {
        if (key === 'adminJwt') return null;
        return null;
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('JWT configuration error'),
      );
    });

    it('should throw UnauthorizedException when admin email is missing', async () => {
      mockRequest.headers.authorization = 'Bearer token';
      mockConfigService.get.mockImplementation((key) => {
        if (key === 'adminJwt') return { secret: 'test-secret' };
        if (key === 'ADMIN_EMAIL') return null;
        return null;
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('Admin configuration error'),
      );
    });

    it('should allow access for valid admin token', async () => {
      const mockToken = 'Bearer valid.jwt.token';
      const mockAdminEmail = 'admin@example.com';
      const mockDecodedToken = {
        role: 'admin',
        sub: mockAdminEmail,
      };

      mockRequest.headers.authorization = mockToken;

      mockJwtService.verify.mockReturnValue(mockDecodedToken);
      mockConfigService.get.mockImplementation((key) => {
        if (key === 'adminJwt') return { secret: 'test-secret' };
        if (key === 'ADMIN_EMAIL') return mockAdminEmail;
        return null;
      });

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockRequest.user).toEqual(mockDecodedToken);
      expect(jwtService.verify).toHaveBeenCalledWith('valid.jwt.token', {
        secret: 'test-secret',
      });
    });

    it('should deny access for non-admin token', async () => {
      const mockToken = 'Bearer valid.jwt.token';
      const mockAdminEmail = 'admin@example.com';
      const mockDecodedToken = {
        role: 'not_admin',
        sub: 'user@example.com',
      };

      mockRequest.headers.authorization = mockToken;

      mockJwtService.verify.mockReturnValue(mockDecodedToken);
      mockConfigService.get.mockImplementation((key) => {
        if (key === 'adminJwt') return { secret: 'test-secret' };
        if (key === 'ADMIN_EMAIL') return mockAdminEmail;
        return null;
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('Not an admin user'),
      );
    });

    it('should deny access for invalid token', async () => {
      const mockToken = 'Bearer invalid.token';
      mockRequest.headers.authorization = mockToken;

      mockConfigService.get.mockImplementation((key) => {
        if (key === 'adminJwt') return { secret: 'test-secret' };
        if (key === 'ADMIN_EMAIL') return 'admin@example.com';
        return null;
      });

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('Invalid token'),
      );
    });
  });
});
