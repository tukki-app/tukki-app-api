import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1680000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Extensions
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

        // 2. Trigger Function
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_updated_at()
            RETURNS TRIGGER AS $$
            BEGIN
               NEW.updated_at = NOW();
               RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 3. Table Users
        await queryRunner.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                phone VARCHAR(20) NOT NULL,
                name VARCHAR(100),
                role VARCHAR(20) NOT NULL CHECK (role IN ('PASSENGER', 'DRIVER')),
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                deleted_at TIMESTAMP NULL,
                CONSTRAINT check_phone_format CHECK (phone ~ '^\\+221[0-9]{9}$')
            )
        `);
        // Unique index for non-deleted users
        await queryRunner.query(`
            CREATE UNIQUE INDEX idx_users_phone_unique_active 
            ON users(phone) 
            WHERE deleted_at IS NULL
        `);
        await queryRunner.query(`CREATE INDEX idx_users_phone ON users(phone)`);
        await queryRunner.query(`CREATE INDEX idx_users_role ON users(role)`);
        await queryRunner.query(`
            CREATE TRIGGER trigger_update_users
            BEFORE UPDATE ON users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        `);

        // 4. Table Trips
        await queryRunner.query(`
            CREATE TABLE trips (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                driver_id UUID NOT NULL,
                departure_city VARCHAR(100) NOT NULL,
                destination_city VARCHAR(100) NOT NULL,
                departure_time TIMESTAMP NOT NULL,
                capacity INT NOT NULL CHECK (capacity > 0),
                available_seats INT NOT NULL CHECK (available_seats >= 0),
                status VARCHAR(20) NOT NULL CHECK (
                    status IN ('ACTIVE', 'FULL', 'CANCELLED', 'COMPLETED')
                ),
                price INT,
                version INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                deleted_at TIMESTAMP NULL,
                CONSTRAINT fk_driver FOREIGN KEY(driver_id) REFERENCES users(id),
                CONSTRAINT check_seats_valid CHECK (available_seats <= capacity)
            )
        `);
        await queryRunner.query(`
            CREATE INDEX idx_trips_search 
            ON trips(departure_city, destination_city, departure_time)
        `);
        await queryRunner.query(`CREATE INDEX idx_trips_driver ON trips(driver_id)`);
        await queryRunner.query(`
            CREATE INDEX idx_trips_active 
            ON trips(departure_city, destination_city, departure_time)
            WHERE status = 'ACTIVE' AND deleted_at IS NULL
        `);
        await queryRunner.query(`
            CREATE TRIGGER trigger_update_trips
            BEFORE UPDATE ON trips
            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        `);

        // 5. Table Bookings
        await queryRunner.query(`
            CREATE TABLE bookings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                trip_id UUID NOT NULL,
                passenger_id UUID NOT NULL,
                seats INT NOT NULL CHECK (seats > 0),
                status VARCHAR(20) NOT NULL CHECK (
                    status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED')
                ),
                idempotency_key VARCHAR(100),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                deleted_at TIMESTAMP NULL,
                CONSTRAINT fk_trip FOREIGN KEY(trip_id) REFERENCES trips(id),
                CONSTRAINT fk_passenger FOREIGN KEY(passenger_id) REFERENCES users(id)
            )
        `);
        await queryRunner.query(`CREATE INDEX idx_bookings_trip ON bookings(trip_id)`);
        await queryRunner.query(`CREATE INDEX idx_bookings_passenger ON bookings(passenger_id)`);
        await queryRunner.query(`
            CREATE UNIQUE INDEX idx_bookings_idempotency 
            ON bookings(idempotency_key)
            WHERE idempotency_key IS NOT NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX unique_booking_per_trip 
            ON bookings(trip_id, passenger_id)
            WHERE deleted_at IS NULL
        `);
        await queryRunner.query(`
            CREATE TRIGGER trigger_update_bookings
            BEFORE UPDATE ON bookings
            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        `);

        // 6. Table Driver Availability
        await queryRunner.query(`
            CREATE TABLE driver_availability (
                driver_id UUID PRIMARY KEY,
                is_online BOOLEAN DEFAULT FALSE,
                last_seen TIMESTAMP DEFAULT NOW(),
                CONSTRAINT fk_driver_availability 
                FOREIGN KEY(driver_id) REFERENCES users(id)
            )
        `);

        // 7. Table Audit Logs
        await queryRunner.query(`
            CREATE TABLE audit_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                entity_type VARCHAR(50),
                entity_id UUID,
                action VARCHAR(50),
                performed_by UUID,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        await queryRunner.query(`
            CREATE INDEX idx_audit_logs_entity 
            ON audit_logs(entity_type, entity_id)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE audit_logs`);
        await queryRunner.query(`DROP TABLE driver_availability`);
        await queryRunner.query(`DROP TABLE bookings`);
        await queryRunner.query(`DROP TABLE trips`);
        await queryRunner.query(`DROP TABLE users`);
        await queryRunner.query(`DROP FUNCTION update_updated_at CASCADE`);
    }
}
