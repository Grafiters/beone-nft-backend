import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PaymentDetails1725586958491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_details',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'hash',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'contract_address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'from',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'to',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 18,
            scale: 8,
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'payment_pending_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'payment_success_at',
            type: 'timestamp',
            isNullable: true,
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
    await queryRunner.dropTable('payment_details');
  }
}
