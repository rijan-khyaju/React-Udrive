import { useMemo, useState } from 'react';
import Modal from '../../components/admin/Modal';
import { studentList } from '../../data/adminData';

const statusOptions = ['All', 'Active', 'Pending', 'Inactive'];
const courseOptions = ['Basic Driving', 'License Prep', 'Night Driving', 'Defensive Driving'];

export default function StudentsPage() {
  const [students, setStudents] = useState(studentList);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', gender: 'Female', dob: '', course: courseOptions[0], emergencyContact: '' });

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = [student.id, student.name, student.email, student.course].some((value) =>
        value.toLowerCase().includes(search.toLowerCase()),
      );
      const matchesFilter = filter === 'All' || student.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [students, search, filter]);

  const openEditor = (student = null) => {
    setEditor(student);
    setForm(student ? {
      fullName: student.name,
      email: student.email,
      phone: student.phone,
      address: student.address || 'Kathmandu, Nepal',
      gender: student.gender || 'Female',
      dob: student.dob || '2002-09-18',
      course: student.course,
      emergencyContact: student.emergencyContact || '+977-9841000000',
    } : {
      fullName: '', email: '', phone: '', address: '', gender: 'Female', dob: '', course: courseOptions[0], emergencyContact: '',
    });
    setModalOpen(true);
  };

  const saveStudent = () => {
    const updated = {
      id: editor?.id || `ST-${Math.floor(Math.random() * 900 + 100)}`,
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      course: form.course,
      status: editor?.status || 'Active',
      address: form.address,
      gender: form.gender,
      dob: form.dob,
      emergencyContact: form.emergencyContact,
    };

    setStudents((prev) => {
      if (editor) {
        return prev.map((student) => (student.id === editor.id ? updated : student));
      }
      return [updated, ...prev];
    });
    setModalOpen(false);
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  return (
    <section className="page-section">
      <div className="page-actions">
        <div className="search-filter-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => openEditor()}>Add Student</button>
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <h3>Student Management</h3>
          <span className="panel-label">{filteredStudents.length} records</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course}</td>
                  <td><span className={`status-chip status-${student.status.toLowerCase()}`}>{student.status}</span></td>
                  <td className="table-actions">
                    <button className="action-btn">View</button>
                    <button className="action-btn" onClick={() => openEditor(student)}>Edit</button>
                    <button className="action-btn action-delete" onClick={() => deleteStudent(student.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editor ? 'Edit Student' : 'Add Student'}
        onClose={() => setModalOpen(false)}
        footer={<button className="btn btn-primary" onClick={saveStudent}>{editor ? 'Update Student' : 'Create Student'}</button>}
      >
        <div className="form-grid">
          <label>
            Full Name
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label>
            Address
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </label>
          <label>
            Gender
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Date of Birth
            <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
          </label>
          <label>
            Course
            <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
              {courseOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Emergency Contact
            <input value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
          </label>
        </div>
      </Modal>
    </section>
  );
}
