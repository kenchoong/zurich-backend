/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AccessTokenDto } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    create: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const signInDto: SignInDto = {
        email: '123@gmail.com',
      };

      const mockToken = new AccessTokenDto('mock.token', 1234567890);
      mockAuthService.create.mockResolvedValue(mockToken);

      const result = await controller.signIn(signInDto);

      expect(result).toEqual({
        message: 'Sign in successful',
        issueToken: mockToken,
      });
      expect(mockAuthService.create).toHaveBeenCalledWith({
        sub: signInDto.email,
        iss: 'zurich-stuff',
        aud: 'admin-user',
      });
    });

    it('should throw BadRequestException with correct message when service throws error', async () => {
      const signInDto: SignInDto = {
        email: 'invalid@gmail.com',
      };

      mockAuthService.create.mockRejectedValue(new Error('Invalid email'));

      await expect(controller.signIn(signInDto)).rejects.toThrow(
        new BadRequestException('some error occured'),
      );
    });
  });
});
