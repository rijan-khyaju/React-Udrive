import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import BookingModal from '../components/BookingModal';
import { adminBookings } from '../data/adminData';

const bookingFilters = ['All', 'Pending', 'Approved', 'Completed', 'Cancelled'];

const statusClass = {
  Pending: 'badge-pending',
  Approved: 'badge-approved',
  Completed: 'badge-completed',
  Cancelled: 'badge-cancelled',
};

const paymentClass = {
  Paid: 'badge-paid',
  Pending: 'badge-pending',
  Refunded: 'badge-cancelled',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState(adminBookings);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = search.toLowerCase();
      const matchesSearch =
        booking.student.toLowerCase().includes(query) ||
        booking.booking_id.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || booking.booking_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeBookingModal = () => {
    setSelectedBooking(null);
    setModalOpen(false);
  };

  const handleApprove = (bookingId) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.booking_id === bookingId ? { ...booking, booking_status: 'Approved', payment_status: booking.payment_status === 'Pending' ? 'Paid' : booking.payment_status } : booking
      )
    );
  };

  const handleCancel = (bookingId) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.booking_id === bookingId ? { ...booking, booking_status: 'Cancelled' } : booking
      )
    );
  };

  return (
    <section className="admin-page admin-bookings">
      <div className="bookings-page-header">
        <div>
          <h2>Bookings</h2>
          <p className="page-copy">Manage bookings, track payment status, and update reservation flows.</p>
        </div>
      </div>

      <div className="bookings-filters">
        <div className="filter-group">
          <label htmlFor="booking-search">Search</label>
          <input
            id="booking-search"
            type="search"
            placeholder="Search by student name or booking ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="booking-status-filter">Status</label>
          <select id="booking-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {bookingFilters.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card admin-card-large">
        <div className="admin-card-header">
          <h3>Booking queue</h3>
          <span>{filteredBookings.length} bookings</span>
        </div>
        <DataTable
          columns={['Booking ID', 'Student Name', 'Course', 'Booking Date', 'Payment Status', 'Booking Status', 'Actions']}
          rows={filteredBookings}
          renderCell={(booking, fieldKey) => {
            if (fieldKey === 'payment_status') {
              return <span className={`badge ${paymentClass[booking.payment_status] || 'badge-pending'}`}>{booking.payment_status}</span>;
            }
            if (fieldKey === 'booking_status') {
              return <span className={`badge ${statusClass[booking.booking_status] || 'badge-pending'}`}>{booking.booking_status}</span>;
            }
            return undefined;
          }}
          renderActions={(booking) => (
            <div className="booking-actions">
              <button className="action-btn" type="button" onClick={() => openBookingModal(booking)}>View</button>
              <button
                className="action-btn"
                type="button"
                onClick={() => handleApprove(booking.booking_id)}
                disabled={booking.booking_status === 'Approved' || booking.booking_status === 'Completed' || booking.booking_status === 'Cancelled'}
              >
                Approve
              </button>
              <button
                className="action-btn action-delete"
                type="button"
                onClick={() => handleCancel(booking.booking_id)}
                disabled={booking.booking_status === 'Cancelled' || booking.booking_status === 'Completed'}
              >
                Cancel
              </button>
            </div>
          )}
          onRowClick={null}
        />
      </div>

      <BookingModal open={modalOpen} booking={selectedBooking} onClose={closeBookingModal} />
    </section>
  );
}
