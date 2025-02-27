import { Injectable, NotFoundException } from '@nestjs/common';
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
  }

  async update(id: number, body: BillingRecordUpdateBodyDto) {
    const billing = await this.repo.findOne({
      where: { id: id },
    });

    if (!billing) {
      throw new NotFoundException(`Billing record with id ${id} not found`);
    }

    billing.location = body.location;
    billing.premiumPaidAmount = Math.round(body.premiumPaidAmount * 100); // Convert decimal to integer by multiplying by 100
    billing.email = body.email;
    billing.firstName = body.firstName;
    billing.lastName = body.lastName;
    billing.photo = body.photo;

    return this.repo.save(billing);
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
