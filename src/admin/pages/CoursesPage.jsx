import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import CourseModal from '../components/CourseModal';
import useCourses from '../hooks/useCourses';

const statusOptions = ['All', 'Active', 'Draft', 'Paused'];

export default function CoursesPage() {
  const { courses, loading, error, addCourse, updateCourse, deleteCourse, refreshCourses } = useCourses();
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

  const handleSubmitCourse = async (courseData) => {
    const normalizedCourse = {
      ...courseData,
      priceNPR: courseData.priceNPR ?? courseData.fee ?? courseData.price ?? '',
      course_name: courseData.name,
      students: courseData.students ?? courseData.number_of_students ?? 0,
      number_of_students: courseData.number_of_students ?? courseData.students ?? 0,
    };

    if (modalMode === 'edit') {
      await updateCourse(selectedCourse.course_id, normalizedCourse);
    } else {
      await addCourse(normalizedCourse);
    }

    await refreshCourses();
    setModalOpen(false);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Delete this course?')) {
      await deleteCourse(courseId);
    }
  };

  return (
    <section className="admin-page admin-courses">
      <div className="courses-page-header">
        <div>
          <h2>Courses</h2>
          <p className="page-copy">Manage course offerings, pricing, and schedule availability.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal} disabled={loading}>Add Course</button>
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

      {loading ? (
        <div className="admin-card admin-card-large">
          <div className="admin-card-header">
            <h3>Course catalog</h3>
          </div>
          <p>Loading courses...</p>
        </div>
      ) : error ? (
        <div className="admin-card admin-card-large">
          <div className="admin-card-header">
            <h3>Course catalog</h3>
          </div>
          <p className="error-message">{error.message || 'Unable to load courses.'}</p>
          <button className="btn-secondary" type="button" onClick={refreshCourses}>Retry</button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="admin-card admin-card-large">
          <div className="admin-card-header">
            <h3>Course catalog</h3>
          </div>
          <p>No courses found. Add a new course to get started.</p>
        </div>
      ) : (
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
      )}

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
