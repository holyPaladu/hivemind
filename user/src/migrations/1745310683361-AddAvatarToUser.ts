import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarToUser1745310683361 implements MigrationInterface {
    name = 'AddAvatarToUser1745310683361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    }

}
