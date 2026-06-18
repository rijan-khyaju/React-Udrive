import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';

const emptyInstructor = {
  instructor_id: '',
  name: '',
  email: '',
  phone: '',
  experience: '',
  assigned_course: '',
  status: 'Active',
};

export default function InstructorModal({ open, mode, instructor, courses, formRef, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyInstructor);
  const [emailError, setEmailError] = useState('');
  const modalTopRef = useRef(null);
  const isView = mode === 'view';

  useEffect(() => {
    if (open) {
      setForm(instructor ? { ...instructor } : emptyInstructor);
      setEmailError('');
      setTimeout(() => {
        modalTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [open, instructor]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'phone') {
      const cleaned = value.replace(/[^0-9+]/g, '');
      setForm((prev) => ({ ...prev, phone: cleaned }));
      return;
    }

    if (name === 'email') setEmailError('');

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isView) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setEmailError('Please enter a valid email address (e.g. name@example.com)');
        return;
      }
      onSubmit(form);
    }
  };

  return (
    <Modal open={open} title={isView ? 'Instructor Details' : mode === 'edit' ? 'Edit Instructor' : 'Add Instructor'} onClose={onClose}>
      <div ref={modalTopRef} />
      <form ref={formRef} className="instructor-form" onSubmit={handleSubmit}>
        <div className="instructor-form-row">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="instructor-form-row">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} disabled={isView} required />
          {emailError && <span style={{ color: 'red', fontSize: '0.8rem', marginTop: 4 }}>{emailError}</span>}
        </div>

        <div className="instructor-form-row">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" inputMode="numeric" value={form.phone} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="instructor-form-row">
          <label htmlFor="experience">Experience</label>
          <input id="experience" name="experience" value={form.experience} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="instructor-form-row">
          <label htmlFor="assigned_course">Assigned Course</label>
          <select id="assigned_course" name="assigned_course" value={form.assigned_course} onChange={handleChange} disabled={isView} required>
            <option value="">Select a course</option>
            {(courses || []).map((course) => (
              <option key={course.id ?? course.course_id} value={course.title ?? course.name}>
                {course.title ?? course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="instructor-form-row">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange} disabled={isView}>
            <option>Active</option>
            <option>On Leave</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="course-form-actions instructor-form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
          {!isView && (
            <button type="submit" className="btn-primary">
              {mode === 'edit' ? 'Save Changes' : 'Add Instructor'}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}