import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BillingRecordService } from './billing-record.service';
import {
  BillingRecordQueryDto,
  BillingRecordUpdateQueryDto,
} from './dto/billing-record.dto';
import {
  BillingRecordCreateDto,
  BillingRecordUpdateBodyDto,
} from './dto/billing-record.input';
import { AdminAuthJwtGuard } from '../auth/guards/admin.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Billing Records')
@ApiBearerAuth('JWT')
@Controller('billing-records')
export class BillingRecordController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly service: BillingRecordService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve billing records',
    description:
      'Accessible by all types of users. Optionally filter by product code and location.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of billing records',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              productId: { type: 'string' },
              location: { type: 'string' },
              premiumPaidAmount: { type: 'number' },
              email: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              photo: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid query parameter format' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async findAll(@Query() query: BillingRecordQueryDto) {
    return this.service.findAll(query);
  }

  @Post()
  @UseGuards(AdminAuthJwtGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Create a new billing record',
    description:
      'Admin access only: Creates a new billing record with all required fields.',
  })
  @ApiResponse({
    status: 201,
    description: 'Record created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '1' },
        productId: { type: 'string', example: '21313' },
        location: { type: 'string', example: 'east' },
        premiumPaidAmount: { type: 'number', example: 0 },
        email: { type: 'string', example: 'matchartproduction@gmail.com' },
        firstName: { type: 'string', example: 'Ken' },
        lastName: { type: 'string', example: 'choong' },
        photo: { type: 'string', example: 'https://jwt.io/' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: '21313' },
        location: { type: 'string', example: 'east' },
        premiumPaidAmount: { type: 'number', example: 0 },
        email: { type: 'string', example: 'matchartproduction@gmail.com' },
        firstName: { type: 'string', example: 'Ken' },
        lastName: { type: 'string', example: 'choong' },
        photo: { type: 'string', example: 'https://jwt.io/' },
      },
      required: [
        'productId',
        'location',
        'premiumPaidAmount',
        'email',
        'firstName',
        'lastName',
        'photo',
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['productCode must be a string'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  createBillingRecord(@Body() createDto: BillingRecordCreateDto) {
    return this.service.create(createDto);
  }

  @Put()
  @UseGuards(AdminAuthJwtGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Update a billing record',
    description:
      'Admin access only: Updates a billing record by providing the product code as a query parameter and the new location and premiumPaid in the request body.',
  })
  @ApiResponse({
    status: 200,
    description: 'Billing record updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        productId: { type: 'string' },
        location: { type: 'string' },
        premiumPaidAmount: { type: 'number' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        photo: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['location must be a string'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Billing record not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Billing record with product code PROD123 not found',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  updateBillingRecord(
    @Query() query: BillingRecordUpdateQueryDto,
    @Body() body: BillingRecordUpdateBodyDto,
  ) {
    return this.service.update(query.id, body);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete a billing record',
    description:
      'Admin access only: Deletes a billing record based on the provided product code in the query parameters.',
  })
  @UseGuards(AdminAuthJwtGuard, RolesGuard)
  @Roles('admin')
  @ApiResponse({
    status: 200,
    description: 'Billing record deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Billing record deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid product code',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['productCode must be a string'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Billing record not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Billing record with product code PROD123 not found',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  deleteBillingRecord(@Query() query: BillingRecordUpdateQueryDto) {
    return this.service.delete(query.id);
  }
}
