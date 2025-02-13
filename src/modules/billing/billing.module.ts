import { CqrsModule } from '@nestjs/cqrs';
import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { BillingController } from './billing.controller';
import { BillingEntity } from './billing.entity';
import { BillingService } from './billing.service';
import { Module } from '@nestjs/common';
import { CommandHandlers, EventHandlers, QueryHandlers } from './cqrs';
import { BillingDto } from './dto/billing.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([BillingEntity]),
        CqrsModule,
      ],
      resolvers: [
        {
          EntityClass: BillingEntity,
          DTOClass: BillingDto,
          read: { disabled: true },
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
          pagingStrategy: PagingStrategies.OFFSET,
          enableTotalCount: true,
        },
      ],
    }),
    CqrsModule,
  ],
  providers: [
    ...EventHandlers,
    ...CommandHandlers,
    ...QueryHandlers,
    BillingService,
  ],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
