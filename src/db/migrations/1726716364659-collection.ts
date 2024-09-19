import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Collection1726716364659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'collections',
        columns: [
          {
            name: 'id',
            type: 'int',
            isUnique: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uid',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'contract_address',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'hash',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'symbol',
            type: 'varchar',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'logo_url',
            type: 'varchar',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'mint_type',
            type: 'varchar',
            default: 'self',
            isUnique: false,
            isNullable: false,
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
            onUpdate: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('collections');
  }
}
