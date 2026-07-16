/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Init1784163582263 {
    name = 'Init1784163582263'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSE" DROP CONSTRAINT "FK_7c9837d128ab474cb3d409b448d"`);
        await queryRunner.query(`ALTER TABLE "USER" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "COURSE" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "COURSE" ADD CONSTRAINT "FK_7c9837d128ab474cb3d409b448d" FOREIGN KEY ("user_id") REFERENCES "USER"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "COURSE" DROP CONSTRAINT "FK_7c9837d128ab474cb3d409b448d"`);
        await queryRunner.query(`ALTER TABLE "COURSE" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "USER" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "COURSE" ADD CONSTRAINT "FK_7c9837d128ab474cb3d409b448d" FOREIGN KEY ("user_id") REFERENCES "USER"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
