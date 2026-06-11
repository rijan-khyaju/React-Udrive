import Modal from './Modal';

export default function BookingModal({ open, booking, onClose }) {
  if (!booking) return null;

  return (
    <Modal open={open} title="Booking Details" onClose={onClose}>
      <div className="booking-modal-details">
        <div className="modal-row">
          <span>Booking ID</span>
          <strong>{booking.booking_id}</strong>
        </div>
        <div className="modal-row">
          <span>Student Name</span>
          <strong>{booking.student}</strong>
        </div>
        <div className="modal-row">
          <span>Course</span>
          <strong>{booking.course}</strong>
        </div>
        <div className="modal-row">
          <span>Booking Date</span>
          <strong>{booking.booking_date}</strong>
        </div>
        <div className="modal-row">
          <span>Payment Status</span>
          <strong>{booking.payment_status}</strong>
        </div>
        <div className="modal-row">
          <span>Booking Status</span>
          <strong>{booking.booking_status}</strong>
        </div>
        <p className="modal-note">This modal displays booking details using dummy data only.</p>
      </div>
    </Modal>
  );
}
