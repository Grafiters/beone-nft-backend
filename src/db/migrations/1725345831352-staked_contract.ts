import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class StackedContract1725345831352 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'staked_contracts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'payment_detail_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'contract_address',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'symbol',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'staked_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'reward_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'reward_per_block',
            type: 'varchar',
            isNullable: true,
            default: '0',
          },
          {
            name: 'start_block',
            type: 'int',
            default: 0,
          },
          {
            name: 'bonus_end_block',
            type: 'int',
            default: 0,
          },
          {
            name: 'status',
            type: 'varchar',
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
    await queryRunner.dropTable('staked_contracts');
  }
}
