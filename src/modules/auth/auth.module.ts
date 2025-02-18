import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CoreConfigModule, ConfigEnvironmentType as ENV } from '../../config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminAuthJwtGuard } from './guards/admin.guard';
import { AdminAuthJwtStrategy } from './strategies/admin-jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [CoreConfigModule],
      useFactory: (configService: ConfigService) => {
        const jwt = configService.get<ENV['adminJwt']>('adminJwt');
        console.log('JWT Module Config:', {
          secret: jwt.secret,
          expiresIn: jwt.tokenExpiration,
        });
        return {
          secret: jwt.secret,
          signOptions: {
            expiresIn: jwt.tokenExpiration,
            algorithm: 'HS256',
          },
        };
      },
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminAuthJwtGuard,
    AdminAuthJwtStrategy,
    RolesGuard,
    JwtService,
    {
      provide: 'JWT_MODULE_OPTIONS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwt = configService.get('adminJwt');
        return {
          secret: jwt.secret,
          signOptions: {
            expiresIn: jwt.tokenExpiration,
          },
        };
      },
    },
  ],
  exports: [
    AuthService,
    AdminAuthJwtGuard,
    AdminAuthJwtStrategy,
    RolesGuard,
    JwtService,
  ],
})
export class AuthModule {}
