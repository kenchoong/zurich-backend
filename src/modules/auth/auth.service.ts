import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenContext } from './auth.interface';
import { ConfigEnvironmentType as ENV } from '../../config';
import { AccessTokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(ctx: AccessTokenContext): Promise<AccessTokenDto> {
    const { sub } = ctx;

    // get variables in place
    const jwt = this.configService.get<ENV['adminJwt']>('adminJwt');
    const expiresIn = jwt.tokenExpiration;
    // generate access token from payload
    const payload = {
      typ: 'Bearer',
      sub,
      iss: 'zurich-stuff',
      aud: ctx.aud,
      role: 'not_admin', // Add role claim
    };

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    console.log(adminEmail);
    if (sub === adminEmail) {
      payload.role = 'admin';
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn,
    });

    const decodedToken: Record<string, any> = (await this.jwtService.decode(
      accessToken,
    )) as unknown;
    const expiresInUnix = decodedToken.exp;

    // construct access token payload
    return new AccessTokenDto(accessToken, expiresInUnix);
  }
}
