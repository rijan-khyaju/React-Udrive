import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import CourseModal from '../components/CourseModal';
import { adminCourses } from '../data/adminData';

const statusOptions = ['All', 'Active', 'Draft', 'Paused'];

export default function CoursesPage() {
  const [courses, setCourses] = useState(adminCourses);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const query = search.toLowerCase();
      const matchesSearch =
        course.name.toLowerCase().includes(query) ||
        course.course_id.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [courses, search, statusFilter]);

  const openAddModal = () => {
    setSelectedCourse(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setModalMode('edit');
    setModalOpen(true);
  };

  const openViewModal = (course) => {
    setSelectedCourse(course);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleSubmitCourse = (courseData) => {
    const normalizedCourse = {
      ...courseData,
      course_name: courseData.name,
      number_of_students: courseData.students ?? 0,
      students: courseData.students ?? courseData.number_of_students ?? 0,
    };

    if (modalMode === 'edit') {
      setCourses((current) =>
        current.map((item) =>
          item.course_id === courseData.course_id
            ? {
                ...item,
                ...normalizedCourse,
                students: item.students ?? normalizedCourse.students,
                number_of_students: item.number_of_students ?? normalizedCourse.number_of_students,
              }
            : item
        )
      );
    } else {
      const nextId = `CR-${String(courses.length + 1).padStart(3, '0')}`;
      setCourses((current) => [{ ...normalizedCourse, course_id: nextId, status: 'Active' }, ...current]);
    }
    setModalOpen(false);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Delete this course?')) {
      setCourses((current) => current.filter((course) => course.course_id !== courseId));
    }
  };

  return (
    <section className="admin-page admin-courses">
      <div className="courses-page-header">
        <div>
          <h2>Courses</h2>
          <p className="page-copy">Manage course offerings, pricing, and schedule availability.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>Add Course</button>
      </div>

      <div className="courses-filters">
        <div className="filter-group">
          <label htmlFor="course-search">Search</label>
          <input
            id="course-search"
            type="search"
            placeholder="Search by course name or ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="course-status-filter">Status</label>
          <select id="course-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card admin-card-large">
        <div className="admin-card-header">
          <h3>Course catalog</h3>
          <span>{filteredCourses.length} courses</span>
        </div>
        <DataTable
          columns={['Course ID', 'Course Name', 'Duration', 'Fee', 'Number of Students', 'Status', 'Actions']}
          rows={filteredCourses}
          renderActions={(course) => (
            <div className="course-actions">
              <button className="action-btn" type="button" onClick={() => openViewModal(course)}>View</button>
              <button className="action-btn" type="button" onClick={() => openEditModal(course)}>Edit</button>
              <button className="action-btn action-delete" type="button" onClick={() => handleDeleteCourse(course.course_id)}>Delete</button>
            </div>
          )}
        />
      </div>

      <CourseModal
        open={modalOpen}
        mode={modalMode}
        course={selectedCourse}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitCourse}
      />
    </section>
  );
}
