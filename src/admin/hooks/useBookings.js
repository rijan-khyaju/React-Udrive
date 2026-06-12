import { useEffect, useState } from 'react';
import * as bookingService from '../services/bookingService';

export default function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateBooking(bookingId, updates, bookingData) {
  const data = await bookingService.updateBookingStatus(bookingId, updates, bookingData);
  setBookings(data);
}

  return {
    bookings,
    loading,
    error,
    updateBooking,
    refreshBookings: fetchBookings,
  };
}
