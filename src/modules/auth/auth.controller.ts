import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@ApiBearerAuth('JWT')
@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('sign-in')
  @ApiOperation({
    summary: 'User sign in',
    description:
      'Accepts an email. Only the email 123@gmail.com is allowed; otherwise an error is thrown.',
  })
  @ApiResponse({ status: 201, description: 'Sign in successful' })
  @ApiResponse({ status: 400, description: 'Invalid email provided' })
  async signIn(@Body() signInDto: SignInDto): Promise<any> {
    try {
      const issueToken = await this.service.create({
        sub: signInDto.email,
        iss: 'zurich-stuff',
        aud: 'admin-user',
      });
      return { message: 'Sign in successful', issueToken };
    } catch (e) {
      console.log(e);
      throw new BadRequestException('some error occured');
    }
  }
}
