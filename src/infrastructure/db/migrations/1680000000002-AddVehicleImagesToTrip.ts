import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVehicleImagesToTrip1680000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE trips
      ADD COLUMN IF NOT EXISTS vehicle_images text[] DEFAULT '{}'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE trips DROP COLUMN IF EXISTS vehicle_images
    `);
  }
}
