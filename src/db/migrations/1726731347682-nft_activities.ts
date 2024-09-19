import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NftActivities1726731347682 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'nft_activities',
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
            name: 'nft_token_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'referance_type',
            type: 'varchar',
            isUnique: false,
            isNullable: false,
          },
          {
            name: 'reference_id',
            type: 'int',
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
    await queryRunner.dropTable('nft_activities');
  }
}
