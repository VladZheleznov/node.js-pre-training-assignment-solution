import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToUser1790103417321 implements MigrationInterface {
    name = 'AddCreatedAtToUser1790103417321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    }

}
