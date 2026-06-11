import { useEffect, useState } from 'react';
import Modal from './Modal';

const emptyCourse = {
  course_id: '',
  name: '',
  description: '',
  duration: '',
  fee: '',
  status: 'Active',
};

export default function CourseModal({ open, mode, course, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyCourse);
  const isView = mode === 'view';

  useEffect(() => {
    if (open) {
      setForm(course ? { ...course } : emptyCourse);
    }
  }, [open, course]);

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
    <Modal open={open} title={isView ? 'Course Details' : mode === 'edit' ? 'Edit Course' : 'Add Course'} onClose={onClose}>
      <form className="course-form" onSubmit={handleSubmit}>
        <div className="course-form-row">
          <label htmlFor="name">Course Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="course-form-row">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="3" value={form.description} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="course-form-row">
          <label htmlFor="duration">Duration</label>
          <input id="duration" name="duration" value={form.duration} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="course-form-row">
          <label htmlFor="fee">Fee</label>
          <input id="fee" name="fee" value={form.fee} onChange={handleChange} disabled={isView} required />
        </div>

        <div className="course-form-row">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange} disabled={isView}>
            <option>Active</option>
            <option>Draft</option>
            <option>Paused</option>
          </select>
        </div>

        <div className="course-form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
          {!isView && (
            <button type="submit" className="btn-primary">
              {mode === 'edit' ? 'Save Changes' : 'Add Course'}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
