import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class BillingRecordCreateDto {
  @ApiProperty({
    description: 'Product ID for the billing record',
    example: '21313',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Location for the billing record',
    example: 'east',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description:
      'Premium paid amount (can be decimal, will be stored as integer)',
    example: 10.5,
  })
  @IsNumber()
  @Type(() => Number)
  premiumPaidAmount: number;

  @ApiProperty({
    description: 'Email of the billing record owner',
    example: 'matchartproduction@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'First name of the billing record owner',
    example: 'Ken',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the billing record owner',
    example: 'choong',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Photo URL or identifier',
    example: 'https://jwt.io/',
  })
  @IsString()
  photo: string;
}

export class BillingRecordUpdateBodyDto {
  @ApiProperty({
    description: 'New location for the billing record',
    example: 'east',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description:
      'Updated premium paid amount (can be decimal, will be stored as integer)',
    example: 10.5,
  })
  @IsNumber()
  @Type(() => Number)
  premiumPaidAmount: number;

  @ApiProperty({
    description: 'Email of the billing record owner',
    example: 'matchartproduction@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'First name of the billing record owner',
    example: 'Ken',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the billing record owner',
    example: 'choong',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Photo URL or identifier',
    example: 'https://jwt.io/',
  })
  @IsString()
  photo: string;
}
