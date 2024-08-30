import { dataSource } from '@configs/typeorm.config';
import { MigrationExecutor } from 'typeorm/migration/MigrationExecutor';

async function autoMigrate() {
  try {
    await dataSource.initialize();
    const queryRunner = dataSource.createQueryRunner();

    // Check if tables are empty
    const tables = await queryRunner.getTables();
    const emptyTables = await Promise.all(
      tables.map(async (table) => {
        const count = await queryRunner.query(
          `SELECT COUNT(*) FROM "${table.name}"`,
        );
        return {
          table: table.name,
          isEmpty: parseInt(count[0].count, 10) === 0,
        };
      }),
    );

    const shouldRunMigrations = emptyTables.some((table) => table.isEmpty);

    if (shouldRunMigrations) {
      console.log('Running migrations...');
      const migrationExecutor = new MigrationExecutor(dataSource);
      await migrationExecutor.executePendingMigrations();
    } else {
      console.log('Tables are not empty, skipping migrations.');
    }

    await queryRunner.release();
  } catch (error) {
    console.error('Error during auto-migration:', error);
  } finally {
    await dataSource.destroy();
  }
}

autoMigrate();
