import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1739417815217 implements MigrationInterface {
  name = 'Migrations1739417815217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "billing" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "photo" character varying NOT NULL, "product_id" character varying NOT NULL, "location" character varying NOT NULL, "premium_paid_amount" integer NOT NULL, CONSTRAINT "PK_d9043caf3033c11ed3d1b29f73c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "billing"`);
  }
}
