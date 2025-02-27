/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/auth.dto';
import { AccessTokenContext } from './auth.interface';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwtService = {
    signAsync: jest.fn(),
    decode: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a token for non-admin user', async () => {
      const ctx: AccessTokenContext = {
        sub: 'user@example.com',
        iss: 'zurich-stuff',
        aud: 'admin-user',
      };

      const mockToken = 'mock.jwt.token';
      const mockDecodedToken = {
        exp: 1234567890,
      };

      mockConfigService.get.mockImplementation((key) => {
        if (key === 'adminJwt') {
          return { tokenExpiration: '1h' };
        }
        if (key === 'ADMIN_EMAIL') {
          return 'admin@example.com';
        }
        return null;
      });

      mockJwtService.signAsync.mockResolvedValue(mockToken);
      mockJwtService.decode.mockReturnValue(mockDecodedToken);

      const result = await service.create(ctx);

      expect(result).toBeInstanceOf(AccessTokenDto);
      expect(result.accessToken).toBe(mockToken);
      expect(result.expiresIn).toBe(mockDecodedToken.exp);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          typ: 'Bearer',
          sub: ctx.sub,
          iss: 'zurich-stuff',
          aud: ctx.aud,
          role: 'not_admin',
        }),
        expect.any(Object),
      );
    });

    it('should create a token for admin user', async () => {
      const adminEmail = 'admin@example.com';
      const ctx: AccessTokenContext = {
        sub: adminEmail,
        iss: 'zurich-stuff',
        aud: 'admin-user',
      };

      const mockToken = 'mock.admin.jwt.token';
      const mockDecodedToken = {
        exp: 1234567890,
      };

      mockConfigService.get.mockImplementation((key) => {
        if (key === 'adminJwt') {
          return { tokenExpiration: '1h' };
        }
        if (key === 'ADMIN_EMAIL') {
          return adminEmail;
        }
        return null;
      });

      mockJwtService.signAsync.mockResolvedValue(mockToken);
      mockJwtService.decode.mockReturnValue(mockDecodedToken);

      const result = await service.create(ctx);

      expect(result).toBeInstanceOf(AccessTokenDto);
      expect(result.accessToken).toBe(mockToken);
      expect(result.expiresIn).toBe(mockDecodedToken.exp);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          typ: 'Bearer',
          sub: ctx.sub,
          iss: 'zurich-stuff',
          aud: ctx.aud,
          role: 'admin',
        }),
        expect.any(Object),
      );
    });
  });
});
