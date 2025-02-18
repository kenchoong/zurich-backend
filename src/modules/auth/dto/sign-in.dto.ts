import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'User email address',
    example: '123@gmail.com',
  })
  @IsEmail()
  email: string;
}
