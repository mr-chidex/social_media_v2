const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class altname1667816168842 {
  name = 'altname1667816168842';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "myusers" RENAME to "users"`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" RENAME to "myusers"`);
  }
};
