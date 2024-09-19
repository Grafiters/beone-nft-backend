import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Profiles1726731766103 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'profiles',
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
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'username',
            type: 'varchar',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'image',
            type: 'text',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'banner',
            type: 'text',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'bio',
            type: 'longtext',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'discord',
            type: 'varchar',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'sosmed_x',
            type: 'varchar',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'instagram',
            type: 'varchar',
            isUnique: false,
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
            onUpdate: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('profiles');
  }
}
