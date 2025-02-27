/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
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
        user: null,
      };

      mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
        getType: jest.fn(),
        getArgs: jest.fn(),
      } as unknown as ExecutionContext;
    });

    it('should allow access when no roles are required', () => {
      mockReflector.get.mockReturnValue(null);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.get).toHaveBeenCalledWith(
        'roles',
        mockContext.getHandler(),
      );
    });

    it('should allow access when user has required role', () => {
      mockRequest.user = { role: 'admin' };
      mockReflector.get.mockReturnValue(['admin']);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.get).toHaveBeenCalledWith(
        'roles',
        mockContext.getHandler(),
      );
    });

    it('should deny access when user does not have required role', () => {
      mockRequest.user = { role: 'user' };
      mockReflector.get.mockReturnValue(['admin']);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
      expect(reflector.get).toHaveBeenCalledWith(
        'roles',
        mockContext.getHandler(),
      );
    });

    it('should deny access when user has no role', () => {
      mockRequest.user = {};
      mockReflector.get.mockReturnValue(['admin']);

      const result = guard.canActivate(mockContext);

      expect(result).toBeFalsy();
      expect(reflector.get).toHaveBeenCalledWith(
        'roles',
        mockContext.getHandler(),
      );
    });

    it('should deny access when no user is present', () => {
      mockRequest.user = null;
      mockReflector.get.mockReturnValue(['Admin']);

      const result = guard.canActivate(mockContext);

      expect(result).toBeFalsy();
      expect(reflector.get).toHaveBeenCalledWith(
        'roles',
        mockContext.getHandler(),
      );
    });

    it('should handle multiple roles correctly', () => {
      mockRequest.user = { role: 'Editor' };
      mockReflector.get.mockReturnValue(['Admin', 'Editor', 'User']);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.get).toHaveBeenCalledWith(
        'roles',
        mockContext.getHandler(),
      );
    });
  });
});
