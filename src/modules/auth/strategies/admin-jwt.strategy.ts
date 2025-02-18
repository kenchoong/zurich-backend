import { QueryBus } from '@nestjs/cqrs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigEnvironmentType as ENV } from '../../../config';
import { AccessTokenContext, AccessTokenPortalUser } from '../auth.interface';

@Injectable()
export class AdminAuthJwtStrategy extends PassportStrategy(
  Strategy,
  'admin-jwt',
) {
  constructor(
    readonly configService: ConfigService,
    readonly queryBus: QueryBus,
  ) {
    const jwt = configService.get<ENV['adminJwt']>('adminJwt');
    console.log('JWT Config:', { secret: jwt.secret });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt.secret,
      algorithms: ['HS256'],
    });
  }

  async validate(context: AccessTokenContext): Promise<AccessTokenPortalUser> {
    console.log('Validating token context:', { context });

    if (context.aud !== 'admin-user') {
      throw new BadRequestException('Invalid audience');
    }

    if (context.iss !== 'zurich-stuff') {
      throw new BadRequestException('Invalid issuer, not allowed');
    }

    return {
      token: context,
      user: {
        id: context.sub,
        role: 'Admin',
      },
      identity: 'ADMIN_USER',
    };
  }
}
