import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';

@ApiTags('Billing')
@Controller('Billing')
export class BillingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly service: BillingService,
  ) {}

  //Get all billing
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  // @Post()
  // async create(@Body() input: CreateBillingInput) {
  //   //return this.commandBus.execute(new CreateBillingCommand(input));
  // }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() input: UpdateBillingInput) {
  //   //return this.commandBus.execute(new UpdateBillingCommand(id, input));
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   //return this.commandBus.execute(new DeleteBillingCommand(id));
  // }
}
