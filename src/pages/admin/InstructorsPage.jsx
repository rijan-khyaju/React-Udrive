import { useMemo, useState } from 'react';
import Modal from '../../components/admin/Modal';
import { instructorList } from '../../data/adminData';

const statusOptions = ['All', 'Active', 'Leave', 'Pending'];

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState(instructorList);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState({ name: '', contact: '', experience: '', course: '', status: 'Active' });

  const filteredInstructors = useMemo(() => {
    return instructors.filter((item) => {
      const matchesSearch = [item.name, item.contact, item.course, item.experience].some((value) =>
        value.toLowerCase().includes(search.toLowerCase()),
      );
      const matchesFilter = filter === 'All' || item.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [instructors, search, filter]);

  const openEditor = (instructor = null) => {
    setEditor(instructor);
    setForm(instructor || { name: '', contact: '', experience: '', course: '', status: 'Active' });
    setModalOpen(true);
  };

  const saveInstructor = () => {
    const updated = {
      id: editor?.id || `IN-${Math.floor(Math.random() * 900 + 100)}`,
      name: form.name,
      contact: form.contact,
      experience: form.experience,
      course: form.course,
      status: form.status,
    };

    setInstructors((prev) => {
      if (editor) {
        return prev.map((item) => (item.id === editor.id ? updated : item));
      }
      return [updated, ...prev];
    });
    setModalOpen(false);
  };

  const deleteInstructor = (id) => setInstructors((prev) => prev.filter((item) => item.id !== id));

  return (
    <section className="page-section">
      <div className="page-actions">
        <div className="search-filter-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search instructors" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => openEditor()}>Add Instructor</button>
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <h3>Instructor Management</h3>
          <span className="panel-label">{filteredInstructors.length} instructors</span>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Experience</th>
                <th>Assigned Course</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstructors.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.contact}</td>
                  <td>{item.experience}</td>
                  <td>{item.course}</td>
                  <td><span className={`status-chip status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                  <td className="table-actions">
                    <button className="action-btn" onClick={() => openEditor(item)}>Edit</button>
                    <button className="action-btn action-delete" onClick={() => deleteInstructor(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editor ? 'Edit Instructor' : 'Add Instructor'}
        onClose={() => setModalOpen(false)}
        footer={<button className="btn btn-primary" onClick={saveInstructor}>{editor ? 'Save Instructor' : 'Create Instructor'}</button>}
      >
        <div className="form-grid">
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Contact
            <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          </label>
          <label>
            Experience
            <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          </label>
          <label>
            Assigned Course
            <input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Active</option>
              <option>Leave</option>
              <option>Pending</option>
            </select>
          </label>
        </div>
      </Modal>
    </section>
  );
}
