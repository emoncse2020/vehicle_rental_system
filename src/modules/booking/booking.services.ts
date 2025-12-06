import { pool } from "../../config/db";

const createBookings = async (
  customerId: number,
  vehicleId: number,
  start: string,
  end: string
) => {
  const vehicle = await pool.query(
    `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id=$1 AND availability_status='available'`,
    [vehicleId]
  );
  if (vehicle.rows.length === 0) throw new Error("Vehicle not available");

  const days = Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  if (days <= 0) throw new Error("Invalid dates");

  const totalPrice = days * Number(vehicle.rows[0].daily_rent_price);

  const booking = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES($1,$2,$3,$4,$5,'active') RETURNING *`,
    [customerId, vehicleId, start, end, totalPrice]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicleId]
  );

  return { ...booking.rows[0], vehicle: vehicle.rows[0] };
};

const getBookings = async (role: string, userId?: number) => {
  if (role === "admin") {
    const res = await pool.query(
      `SELECT b.*, v.vehicle_name FROM bookings b JOIN vehicles v ON b.vehicle_id=v.id ORDER BY b.id`
    );
    return res.rows;
  }
  const res = await pool.query(
    `SELECT b.*, v.vehicle_name FROM bookings b JOIN vehicles v ON b.vehicle_id=v.id WHERE b.customer_id=$1 ORDER BY b.id`,
    [userId]
  );
  return res.rows;
};

const updateBookings = async (
  bookingId: string,
  status: string,
  role: string,
  userId?: number
) => {
  const res = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);
  if (res.rows.length === 0) throw new Error("Booking not found");
  const booking = res.rows[0];

  if (role === "customer" && booking.customer_id !== userId)
    throw new Error("Can only update your own booking");
  if (role === "customer" && status !== "cancelled")
    throw new Error("Customer can only cancel");

  const updated = await pool.query(
    `UPDATE bookings SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, bookingId]
  );

  if (
    (role === "admin" && status === "returned") ||
    (role === "customer" && status === "cancelled")
  ) {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
  }

  return updated.rows[0];
};
export const bookingServices = {
  createBookings,
  getBookings,
  updateBookings,
};
