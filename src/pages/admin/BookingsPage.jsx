import { useMemo, useState } from 'react';
import { bookingList } from '../../data/adminData';

const statusFilters = ['All', 'Pending', 'Approved', 'Completed', 'Cancelled'];

export default function BookingsPage() {
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');

  const filteredBookings = useMemo(() => {
    return bookingList.filter((booking) => {
      const matchesStatus = status === 'All' || booking.status === status;
      const matchesSearch = [booking.id, booking.student, booking.course].some((value) =>
        value.toLowerCase().includes(search.toLowerCase()),
      );
      return matchesStatus && matchesSearch;
    });
  }, [status, search]);

  return (
    <section className="page-section">
      <div className="page-actions">
        <div className="search-filter-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusFilters.map((filter) => <option key={filter} value={filter}>{filter}</option>)}
          </select>
        </div>
        <button className="btn btn-primary">Add Booking</button>
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <h3>Booking Management</h3>
          <span className="panel-label">{filteredBookings.length} bookings</span>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Booking Date</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.student}</td>
                  <td>{booking.course}</td>
                  <td>{booking.date}</td>
                  <td>{booking.payment}</td>
                  <td><span className={`status-chip status-${booking.status.toLowerCase()}`}>{booking.status}</span></td>
                  <td className="table-actions">
                    <button className="action-btn">View</button>
                    <button className="action-btn">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
