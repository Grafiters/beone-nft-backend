import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1724984885317 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'address',
            type: 'varchar',
            isUnique: true,
            zerofill: false,
            length: '150',
          },
          {
            name: 'fotoUrl',
            type: 'varchar',
            zerofill: true,
          },
          {
            name: 'bannerUrl',
            type: 'varchar',
            zerofill: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
