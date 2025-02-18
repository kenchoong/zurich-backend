import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameBillingToBillingRecord1739417815218
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "billing" RENAME TO "billing_record"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "billing_record" RENAME TO "billing"`);
  }
}
