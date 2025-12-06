import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const createBookings = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;
    const booking = await bookingServices.createBookings(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );
    res.json({ success: true, booking });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    const userId = req.user!.id;
    const bookings = await bookingServices.getBookings(role, userId);
    res.json({ success: true, bookings });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateBookings = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId as string;
    const { status } = req.body;
    const role = req.user!.role;
    const userId = req.user!.id;

    const booking = await bookingServices.updateBookings(
      bookingId,
      status,
      role,
      userId
    );
    res.json({ success: true, booking });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const bookingControllers = {
  createBookings,
  getBookings,
  updateBookings,
};
