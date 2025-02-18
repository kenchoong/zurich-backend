import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { BillingRecordEntity } from './billing-record.entity';
import { BillingRecordController } from './billing-record.controller';
import { BillingRecordService } from './billing-record.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillingRecordEntity]),
    NestjsQueryTypeOrmModule.forFeature([BillingRecordEntity]),
    CqrsModule,
    AuthModule,
  ],
  controllers: [BillingRecordController],
  providers: [BillingRecordService],
  exports: [BillingRecordService],
})
export class BillingRecordModule {}
