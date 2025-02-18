import { Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Repository } from 'typeorm';
import { BillingEntity } from './billing.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(BillingEntity)
    private readonly repo: Repository<BillingEntity>,
    @InjectQueryService(BillingEntity)
    private readonly service: QueryService<BillingEntity>,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  findAll() {
    return this.repo.find();
  }
}
