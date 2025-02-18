import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthJwtGuard extends AuthGuard(['admin-jwt']) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const authHeader = request.headers.authorization;

    console.log('Auth Header:', authHeader);

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [type, token] = authHeader.split(' ');

    console.log('Token type:', type);
    console.log('Token:', token);

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid token type');
    }

    const jwt = this.configService.get('adminJwt');
    const adminEmail = this.configService.get('ADMIN_EMAIL');

    if (!jwt || !jwt.secret) {
      console.error('JWT configuration is missing or invalid:', jwt);
      throw new UnauthorizedException('JWT configuration error');
    }

    if (!adminEmail) {
      console.error('Admin email configuration is missing');
      throw new UnauthorizedException('Admin configuration error');
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: jwt.secret,
      });

      console.log('Verified payload:', payload);

      // Check if the token has admin role and sub matches admin email
      console.log('adminEmail', { adminEmail, sub: payload.sub });
      if (payload.role !== 'admin' || payload.sub !== adminEmail) {
        console.log('Non-admin access attempt from:', payload.sub);
        throw new UnauthorizedException('Not an admin user');
      }

      request.user = payload;
      return true;
    } catch (error) {
      console.log('Token verification error:', error);
      throw new UnauthorizedException(
        error.message === 'Not an admin user' ? error.message : 'Invalid token',
      );
    }
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
