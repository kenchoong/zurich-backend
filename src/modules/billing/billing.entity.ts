import { AbstractEntity } from 'nestjs-dev-utilities';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'billing' })
export class BillingEntity extends AbstractEntity {
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  photo: string;

  @Column()
  productId: string;

  @Column()
  location: string;

  @Column()
  premiumPaidAmount: number;
}
