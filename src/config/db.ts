import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initializeDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL CHECK (char_length(password) >= 6),
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50) NOT NULL
        )
        `);
  await pool.query(`
          CREATE TABLE IF NOT EXISTS vehicles(
          id SERIAL PRIMARY KEY,
          vehicle_name VARCHAR(200) NOT NULL,
          type VARCHAR(50) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
          registration_number VARCHAR(200) UNIQUE NOT NULL,
          daily_rent_price NUMERIC(10, 2) NOT NULL CHECK (daily_rent_price > 0),
          availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN('available', 'booked'))
          )
          `);

  await pool.query(`
     CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL,
        vehicle_id INT NOT NULL,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
        status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),

        CONSTRAINT fk_booking_customer
        FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_booking_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
        ON DELETE CASCADE,
        CONSTRAINT check_date_range CHECK (rent_end_date > rent_start_date)
    );

    `);
};

export default initializeDB;
