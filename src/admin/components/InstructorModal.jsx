import { useEffect, useState } from 'react';
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

export default function InstructorModal({ open, mode, instructor, courses, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyInstructor);
  const isView = mode === 'view';

  useEffect(() => {
    if (open) {
      setForm(instructor ? { ...instructor } : emptyInstructor);
    }
  }, [open, instructor]);

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
    <Modal open={open} title={isView ? 'Instructor Details' : mode === 'edit' ? 'Edit Instructor' : 'Add Instructor'} onClose={onClose}>
      <form className="instructor-form" onSubmit={handleSubmit}>
        <div className="instructor-form-row">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="instructor-form-row">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="instructor-form-row">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="instructor-form-row">
          <label htmlFor="experience">Experience</label>
          <input id="experience" name="experience" value={form.experience} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="instructor-form-row">
          <label htmlFor="assigned_course">Assigned Course</label>
          <select id="assigned_course" name="assigned_course" value={form.assigned_course} onChange={handleChange} disabled={isView} required>
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.course_id} value={course.name}>{course.name}</option>
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
