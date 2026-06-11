import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import InstructorModal from '../components/InstructorModal';
import { adminInstructors, adminCourses } from '../data/adminData';

const statusOptions = ['All', 'Active', 'On Leave', 'Inactive'];

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState(adminInstructors);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const filteredInstructors = useMemo(() => {
    return instructors.filter((instructor) => {
      const query = search.toLowerCase();
      const matchesSearch =
        instructor.name.toLowerCase().includes(query) ||
        instructor.instructor_id.toLowerCase().includes(query) ||
        instructor.email.toLowerCase().includes(query) ||
        instructor.phone.toLowerCase().includes(query) ||
        instructor.assigned_course.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || instructor.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [instructors, search, statusFilter]);

  const openAddModal = () => {
    setSelectedInstructor(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const openEditModal = (instructor) => {
    setSelectedInstructor(instructor);
    setModalMode('edit');
    setModalOpen(true);
  };

  const openViewModal = (instructor) => {
    setSelectedInstructor(instructor);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleSubmitInstructor = (instructorData) => {
    const normalizedInstructor = {
      ...instructorData,
      contact: instructorData.phone,
    };

    if (modalMode === 'edit') {
      setInstructors((current) => current.map((item) => (item.instructor_id === instructorData.instructor_id ? normalizedInstructor : item)));
    } else {
      const nextId = `IN-${String(instructors.length + 1).padStart(3, '0')}`;
      setInstructors((current) => [{ ...normalizedInstructor, instructor_id: nextId }, ...current]);
    }
    setModalOpen(false);
  };

  const handleDeleteInstructor = (instructorId) => {
    if (window.confirm('Delete this instructor?')) {
      setInstructors((current) => current.filter((instructor) => instructor.instructor_id !== instructorId));
    }
  };

  return (
    <section className="admin-page admin-instructors">
      <div className="instructors-page-header">
        <div>
          <h2>Instructors</h2>
          <p className="page-copy">Manage teaching staff, assignments, and availability.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>Add Instructor</button>
      </div>

      <div className="instructors-filters">
        <div className="filter-group">
          <label htmlFor="instructor-search">Search</label>
          <input
            id="instructor-search"
            type="search"
            placeholder="Search by name, ID, contact, or course"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="instructor-status-filter">Status</label>
          <select id="instructor-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card admin-card-large">
        <div className="admin-card-header">
          <h3>Instructor roster</h3>
          <span>{filteredInstructors.length} instructors</span>
        </div>
        <DataTable
          columns={['Instructor ID', 'Name', 'Contact', 'Experience', 'Assigned Course', 'Status', 'Actions']}
          rows={filteredInstructors}
          renderActions={(instructor) => (
            <div className="student-actions">
              <button className="action-btn" type="button" onClick={() => openViewModal(instructor)}>View</button>
              <button className="action-btn" type="button" onClick={() => openEditModal(instructor)}>Edit</button>
              <button className="action-btn action-delete" type="button" onClick={() => handleDeleteInstructor(instructor.instructor_id)}>Delete</button>
            </div>
          )}
        />
      </div>

      <InstructorModal
        open={modalOpen}
        mode={modalMode}
        instructor={selectedInstructor}
        courses={adminCourses}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitInstructor}
      />
    </section>
  );
}
