import { useEffect, useState } from 'react';
import Modal from './Modal';

const emptyStudent = {
  student_id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  preferred_time: '',
  booking_date: '',
  course: '',
  emergency_contact: '',
  status: 'Active',
};

export default function StudentModal({ open, mode, student, onClose, onSubmit, courses }) {
  const [form, setForm] = useState(emptyStudent);
  const isView = mode === 'view';

  useEffect(() => {
    if (open) {
      setForm(student ? { ...student } : emptyStudent);
    }
  }, [open, student]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isView) {
      onSubmit(form);
    }
  };

  return (
    <Modal open={open} title={isView ? 'Student Details' : mode === 'edit' ? 'Edit Student' : 'Add Student'} onClose={onClose}>
      <form className="student-form" onSubmit={handleSubmit}>
        <div className="student-form-row">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="student-form-row">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="student-form-row">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="student-form-row">
          <label htmlFor="address">Address</label>
          <textarea id="address" name="address" rows="2" value={form.address} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="student-form-row">
  <label htmlFor="preferred_time">Preferred Time</label>
  <select id="preferred_time" name="preferred_time" value={form.preferred_time} onChange={handleChange} disabled={isView}>
    <option value="">Select time</option>
    <option>7:00 AM – 9:00 AM</option>
    <option>9:00 AM – 11:00 AM</option>
    <option>11:00 AM – 1:00 PM</option>
    <option>2:00 PM – 4:00 PM</option>
    <option>4:00 PM – 6:00 PM</option>
  </select>
</div>

        <div className="student-form-row">
  <label htmlFor="booking_date">Booking Date</label>
  <input id="booking_date" name="booking_date" type="date" value={form.booking_date} onChange={handleChange} disabled={isView} required />
</div>

        <div className="student-form-row">
          <label htmlFor="course">Course</label>
          <select id="course" name="course" value={form.course} onChange={handleChange} disabled={isView} required>
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        <div className="student-form-row">
          <label htmlFor="emergency_contact">Emergency Contact</label>
          <input id="emergency_contact" name="emergency_contact" value={form.emergency_contact} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="student-form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
          {!isView && (
            <button type="submit" className="btn-primary">
              {mode === 'edit' ? 'Save Changes' : 'Add Student'}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
