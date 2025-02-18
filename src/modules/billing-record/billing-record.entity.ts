import { AbstractEntity } from 'nestjs-dev-utilities';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'billing_record' })
export class BillingRecordEntity extends AbstractEntity {
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  productId: string;

  @Column()
  location: string;

  @Column()
  premiumPaidAmount: number;
}
