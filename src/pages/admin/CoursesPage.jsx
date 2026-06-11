import { useMemo, useState } from 'react';
import Modal from '../../components/admin/Modal';
import { courseList } from '../../data/adminData';

const statusOptions = ['All', 'Active', 'Pending', 'Archived'];

export default function CoursesPage() {
  const [courses, setCourses] = useState(courseList);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState({ name: '', duration: '', fee: '', students: 0, status: 'Active' });

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = [course.name, course.duration, course.fee].some((value) =>
        value.toLowerCase().includes(search.toLowerCase()),
      );
      const matchesFilter = filter === 'All' || course.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [courses, search, filter]);

  const openEditor = (course = null) => {
    setEditor(course);
    setForm(course || { name: '', duration: '', fee: '', students: 0, status: 'Active' });
    setModalOpen(true);
  };

  const saveCourse = () => {
    const updated = {
      id: editor?.id || `CR-${Math.floor(Math.random() * 900 + 100)}`,
      name: form.name,
      duration: form.duration,
      fee: form.fee,
      students: form.students,
      status: form.status,
    };

    setCourses((prev) => {
      if (editor) {
        return prev.map((item) => (item.id === editor.id ? updated : item));
      }
      return [updated, ...prev];
    });

    setModalOpen(false);
  };

  const deleteCourse = (id) => setCourses((prev) => prev.filter((item) => item.id !== id));

  return (
    <section className="page-section">
      <div className="page-actions">
        <div className="search-filter-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => openEditor()}>Add Course</button>
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <h3>Course Catalog</h3>
          <span className="panel-label">{filteredCourses.length} courses</span>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Duration</th>
                <th>Fee</th>
                <th>Students</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.duration}</td>
                  <td>{course.fee}</td>
                  <td>{course.students}</td>
                  <td><span className={`status-chip status-${course.status.toLowerCase()}`}>{course.status}</span></td>
                  <td className="table-actions">
                    <button className="action-btn" onClick={() => openEditor(course)}>Edit</button>
                    <button className="action-btn action-delete" onClick={() => deleteCourse(course.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editor ? 'Edit Course' : 'Add Course'}
        onClose={() => setModalOpen(false)}
        footer={<button className="btn btn-primary" onClick={saveCourse}>{editor ? 'Save Changes' : 'Create Course'}</button>}
      >
        <div className="form-grid">
          <label>
            Course Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Duration
            <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </label>
          <label>
            Fee
            <input value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
          </label>
          <label>
            Students
            <input type="number" value={form.students} onChange={(e) => setForm({ ...form, students: Number(e.target.value) })} />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Active</option>
              <option>Pending</option>
              <option>Archived</option>
            </select>
          </label>
        </div>
      </Modal>
    </section>
  );
}
