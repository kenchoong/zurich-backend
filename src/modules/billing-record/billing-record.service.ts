import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Repository } from 'typeorm';
import { BillingRecordEntity } from './billing-record.entity';
import { BillingRecordQueryDto } from './dto/billing-record.dto';
import {
  BillingRecordCreateDto,
  BillingRecordUpdateBodyDto,
} from './dto/billing-record.input';
import { QueryBus, CommandBus } from '@nestjs/cqrs';

@Injectable()
export class BillingRecordService {
  constructor(
    @InjectRepository(BillingRecordEntity)
    private readonly repo: Repository<BillingRecordEntity>,
    @InjectQueryService(BillingRecordEntity)
    private readonly service: QueryService<BillingRecordEntity>,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async findAll(query: BillingRecordQueryDto) {
    const { productCode, location } = query;
    const filter: any = {};

    if (productCode) {
      filter.productId = { eq: productCode };
    }

    if (location) {
      filter.location = { iLike: `%${location}%` };
    }

    const results = await this.service.query({
      filter: Object.keys(filter).length > 0 ? { and: [filter] } : {},
    });

    // Convert the premiumPaidAmount back to decimal by dividing by 100
    return results.map((record) => ({
      ...record,
      premiumPaidAmount: record.premiumPaidAmount / 100,
    }));
  }

  async create(createDto: BillingRecordCreateDto) {
    console.log(createDto);
    try {
      // Ensure premiumPaidAmount is a valid number
      if (isNaN(createDto.premiumPaidAmount)) {
        throw new BadRequestException(
          'premiumPaidAmount must be a valid number',
        );
      }

      const billing = this.repo.create({
        productId: createDto.productId,
        location: createDto.location,
        premiumPaidAmount: Math.round(createDto.premiumPaidAmount * 100), // Convert decimal to integer by multiplying by 100
        email: createDto.email,
        firstName: createDto.firstName,
        lastName: createDto.lastName,
        photo: createDto.photo,
      });

      return this.repo.save(billing);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Error creating billing record: ${error.message}`,
      );
    }
  }

  async update(id: number, body: BillingRecordUpdateBodyDto) {
    try {
      const billing = await this.repo.findOne({
        where: { id: id },
      });

      if (!billing) {
        throw new NotFoundException(`Billing record with id ${id} not found`);
      }

      // Ensure premiumPaidAmount is a valid number
      if (isNaN(body.premiumPaidAmount)) {
        throw new BadRequestException(
          'premiumPaidAmount must be a valid number',
        );
      }

      billing.location = body.location;
      billing.premiumPaidAmount = Math.round(body.premiumPaidAmount * 100); // Convert decimal to integer by multiplying by 100
      billing.email = body.email;
      billing.firstName = body.firstName;
      billing.lastName = body.lastName;
      billing.photo = body.photo;

      return this.repo.save(billing);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error updating billing record: ${error.message}`,
      );
    }
  }

  async delete(id: number) {
    const billing = await this.repo.findOne({
      where: { id: id },
    });

    if (!billing) {
      throw new NotFoundException(
        `Billing record with product code ${id} not found`,
      );
    }

    await this.repo.remove(billing);
    return { message: 'Billing record deleted successfully' };
  }
}
