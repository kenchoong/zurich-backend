import { Directive, ObjectType } from '@nestjs/graphql';
import { AbstractDto } from 'nestjs-dev-utilities';

@ObjectType('Billing')
@Directive('@key(fields: "id")')
export class BillingDto extends AbstractDto {}
