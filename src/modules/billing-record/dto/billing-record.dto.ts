import { Directive, ObjectType } from '@nestjs/graphql';
import { AbstractDto } from 'nestjs-dev-utilities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@ObjectType('BillingRecord')
@Directive('@key(fields: "id")')
export class BillingRecordDto extends AbstractDto {}

export class BillingRecordQueryDto {
  @ApiPropertyOptional({
    description: 'Filter billing record data by product code',
    example: 'PROD123',
  })
  @IsOptional()
  @IsString()
  productCode?: string;

  @ApiPropertyOptional({
    description: 'Filter billing record data by location',
    example: 'West Malaysia',
  })
  @IsOptional()
  @IsString()
  location?: string;
}

export class BillingRecordUpdateQueryDto {
  @ApiProperty({
    description: 'Id of the record',
    example: '123',
  })
  @IsNumber()
  id: number;
}
