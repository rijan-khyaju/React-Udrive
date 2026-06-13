import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig.js';
import DataTable from '../components/DataTable';
import StudentModal from '../components/StudentModal';
import useStudents from '../hooks/useStudents';


const statusOptions = ['All', 'Active', 'Pending', 'Inactive'];

export default function StudentsPage() {
  const { students, loading, error, addStudent, updateStudent, deleteStudent, refreshStudents } = useStudents();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedStudent, setSelectedStudent] = useState(null);

 const [allCourses, setAllCourses] = useState([]);

useEffect(() => {
  async function fetchCourses() {
    try {
      const snap = await getDocs(collection(db, 'courses'));
      const names = snap.docs.map((d) => d.data().name || d.data().title).filter(Boolean).sort();
      setAllCourses(names);
    } catch (err) {
      console.error('fetchCourses error:', err);
    }
  }
  fetchCourses();
}, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase();
      const matchesSearch =
        (student.name || '').toLowerCase().includes(query) ||
        (student.student_id || '').toLowerCase().includes(query) ||
        (student.email || '').toLowerCase().includes(query) ||
        (student.phone || '').toLowerCase().includes(query) ||
        (student.course || '').toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
      const matchesCourse = courseFilter === 'All' || student.course === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [students, search, statusFilter, courseFilter]);

  const openAddModal = () => {
  setSelectedStudent(null);
  setModalMode('add');
  setModalOpen(true);
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 100);
};

const openEditModal = (student) => {
  setSelectedStudent(student);
  setModalMode('edit');
  setModalOpen(true);
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 100);
};

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setModalMode('view');
    setModalOpen(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 0);
  };

  const handleSubmitStudent = async (studentData) => {
    try {
      if (modalMode === 'edit') {
        await updateStudent(studentData);
      } else {
        await addStudent(studentData);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('[StudentsPage] handleSubmitStudent error:', err);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Delete this student record?')) {
      try {
        await deleteStudent(studentId);
      } catch (err) {
        console.error('[StudentsPage] handleDeleteStudent error:', err);
      }
    }
  };

  return (
    <section className="admin-page admin-students">
      <div className="students-page-header">
        <div>
          <h2>Students</h2>
          <p className="page-copy">Manage learners, review enrollment details, and update student records.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>Add Student</button>
      </div>

      <div className="students-filters">
        <div className="filter-group">
          <label htmlFor="student-search">Search</label>
          <input
            id="student-search"
            type="search"
            placeholder="Search by name, ID, email, or phone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="course-filter">Course</label>
          <select id="course-filter" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
            <option value="All">All</option>
           {allCourses.map((course) => (
  <option key={course} value={course}>{course}</option>
))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="admin-card admin-card-large">
          <div className="admin-card-header">
            <h3>Student roster</h3>
          </div>
          <p>Loading students...</p>
        </div>
      ) : error ? (
        <div className="admin-card admin-card-large">
          <div className="admin-card-header">
            <h3>Student roster</h3>
          </div>
          <p className="error-message">{error.message || 'Unable to load students.'}</p>
          <button className="btn-secondary" type="button" onClick={refreshStudents}>Retry</button>
        </div>
      ) : (
        <div className="admin-card admin-card-large">
          <div className="admin-card-header">
            <h3>Student roster</h3>
            <span>{filteredStudents.length} students</span>
          </div>
          <DataTable
            columns={['Student ID', 'Name', 'Email', 'Phone', 'Course', 'Status', 'Actions']}
            rows={filteredStudents}
            renderActions={(student) => (
              <div className="student-actions">
                <button className="action-btn" type="button" onClick={() => openViewModal(student)}>View</button>
                <button className="action-btn" type="button" onClick={() => openEditModal(student)}>Edit</button>
                <button className="action-btn action-delete" type="button" onClick={() => handleDeleteStudent(student.student_id)}>Delete</button>
              </div>
            )}
          />
        </div>
      )}

      <StudentModal
        open={modalOpen}
        mode={modalMode}
        student={selectedStudent}
        courses={allCourses}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitStudent}
      />
    </section>
  );
}
