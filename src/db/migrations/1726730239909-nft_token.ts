import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NftToken1726730239909 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'nft_tokens',
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
            name: 'collection_id',
            type: 'int',
            isNullable: false,
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
            name: 'external_link',
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
            name: 'description',
            type: 'longtext',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'properties',
            type: 'jsonb',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'statistic',
            type: 'jsonb',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'tag',
            type: 'jsonb',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'supply',
            type: 'number',
            default: 1,
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
    await queryRunner.dropTable('nft_tokens');
  }
}
