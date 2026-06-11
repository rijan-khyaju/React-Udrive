import { adminBookings } from '../data/adminData';

let bookings = adminBookings.map((booking) => ({ ...booking }));

const clone = (data) => data.map((item) => ({ ...item }));

export async function getBookings() {
  return clone(bookings);
}

export async function updateBookingStatus(bookingId, updates) {
  bookings = bookings.map((booking) =>
    booking.booking_id === bookingId ? { ...booking, ...updates } : booking
  );
  return clone(bookings);
}
