import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import * as courseService from '../services/courseService';
import * as bookingService from '../services/bookingService';
import * as studentService from '../services/studentService';
import * as instructorService from '../services/instructorService';
import { useAuth } from '../auth/AuthContext';
import { adminStats, adminBookings, adminStudents, adminActivity } from '../data/adminData';

const actionLabels = {
  'add-student': 'Add Student',
  'add-course': 'Add Course',
  'add-instructor': 'Add Instructor',
  'create-booking': 'Create Booking',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [liveStatValues, setLiveStatValues] = useState({
    students: null,
    courses: null,
    instructors: null,
    bookings: null,
    revenue: null,
  });
  const [recentBookings, setRecentBookings] = useState(adminBookings);
  const [recentStudents, setRecentStudents] = useState(adminStudents);

  useEffect(() => {
    async function fetchLiveStats() {
      try {
        const [students, bookings, courses, instructors] = await Promise.all([
          studentService.getStudents(),
          bookingService.getBookings(),
          courseService.getCourses(),
          instructorService.getInstructors(),
        ]);

        const courseFeeMap = {};
        courses.forEach((course) => {
          const courseName = course.name || course.title;
          const price = Number(course.priceNPR ?? course.fee ?? course.price ?? 0);
          courseFeeMap[courseName] = Number.isFinite(price) ? price : 0;
        });

        const revenueTotal = bookings.reduce((sum, booking) => {
          if (booking.payment_status === 'Paid') {
            const fee = booking.fee != null && Number(booking.fee) > 0
              ? Number(booking.fee)
              : (courseFeeMap[booking.course] || 0);
            return sum + fee;
          }
          return sum;
        }, 0);

        setLiveStatValues({
          students: students.length,
          courses: courses.length,
          instructors: instructors.length,
          bookings: bookings.length,
          revenue: `Rs. ${revenueTotal.toLocaleString()}`,
        });
        setRecentBookings(bookings.slice(0, 5));
        setRecentStudents(students.slice(0, 5));
      } catch (error) {
        console.error('[DashboardPage] fetchLiveStats error:', error);
      }
    }

    fetchLiveStats();
  }, []);

  const handleCardClick = (label) => {
    const pathMap = {
      'Total Students': '/admin/students',
      'Total Courses': '/admin/courses',
      'Total Instructors': '/admin/instructors',
      'Total Bookings': '/admin/bookings',
    };
    const path = pathMap[label];
    if (path) navigate(path);
  };

  const openQuickAction = (action) => {
    setSelectedItem(null);
    setActiveModal(action);
  };

  const openBookingDetails = (booking) => {
    setSelectedItem(booking);
    setActiveModal('booking-details');
  };

  const openStudentDetails = (student) => {
    setSelectedItem(student);
    setActiveModal('student-details');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  const renderModalContent = () => {
    if (activeModal === 'booking-details' && selectedItem) {
      return (
        <div>
          <p><strong>Booking ID:</strong> {selectedItem.booking_id}</p>
          <p><strong>Student:</strong> {selectedItem.student}</p>
          <p><strong>Course:</strong> {selectedItem.course}</p>
          <p><strong>Booking Date:</strong> {selectedItem.booking_date}</p>
          <p><strong>Booking Status:</strong> {selectedItem.booking_status}</p>
          <p className="modal-note">This is a placeholder for booking details.</p>
        </div>
      );
    }

    if (activeModal === 'student-details' && selectedItem) {
      return (
        <div>
          <p><strong>Student ID:</strong> {selectedItem.student_id}</p>
          <p><strong>Name:</strong> {selectedItem.name}</p>
          <p><strong>Course:</strong> {selectedItem.course}</p>
          <p><strong>Status:</strong> {selectedItem.status}</p>
          <p className="modal-note">This is a placeholder for student details.</p>
        </div>
      );
    }

    if (activeModal && actionLabels[activeModal]) {
      return (
        <div>
          <p>{actionLabels[activeModal]} modal is open.</p>
          <p className="modal-note">This is a reusable placeholder modal for admin actions.</p>
        </div>
      );
    }

    return null;
  };

  const modalTitle = activeModal === 'booking-details'
    ? 'Booking Details'
    : activeModal === 'student-details'
    ? 'Student Details'
    : activeModal
    ? actionLabels[activeModal]
    : '';

  return (
    <section className="admin-page admin-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-welcome">Welcome back, {user?.displayName || 'Admin'}</p>
          <p className="dashboard-copy">Your UDrive dashboard overview for the latest activity.</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        {adminStats.map((stat) => {
          let value = stat.value;
          if (stat.label === 'Total Students' && liveStatValues.students !== null) value = String(liveStatValues.students);
          if (stat.label === 'Total Courses' && liveStatValues.courses !== null) value = String(liveStatValues.courses);
          if (stat.label === 'Total Instructors' && liveStatValues.instructors !== null) value = String(liveStatValues.instructors);
          if (stat.label === 'Total Bookings' && liveStatValues.bookings !== null) value = String(liveStatValues.bookings);
          if (stat.label === 'Total Revenue' && liveStatValues.revenue !== null) value = liveStatValues.revenue;
          return (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={value}
              delta={stat.delta}
              onClick={() => handleCardClick(stat.label)}
            />
          );
        })}
      </div>

      <div className="admin-grid admin-grid-2">
        <div className="admin-card admin-card-large">
          <div className="admin-card-header">
            <h3>Recent Bookings</h3>
            <span>Latest 7 entries</span>
          </div>
          <DataTable
            columns={['Booking ID', 'Student', 'Course', 'Booking Status', 'Booking Date']}
            rows={recentBookings}
            onRowClick={openBookingDetails}
            renderCell={(row, fieldKey) => {
              if (fieldKey === 'booking_status') {
                const statusClassMap = {
                  Pending: 'badge-pending',
                  Approved: 'badge-approved',
                  Completed: 'badge-completed',
                  Cancelled: 'badge-cancelled',
                };
                return <span className={`badge ${statusClassMap[row.booking_status] || 'badge-pending'}`}>{row.booking_status}</span>;
              }
              return undefined;
            }}
          />
        </div>

        <div className="admin-card admin-card-large">
          <div className="admin-card-header">
            <h3>Recent Students</h3>
            <span>Newest registrations</span>
          </div>
          <DataTable
            columns={['Student ID', 'Name', 'Course', 'Status']}
            rows={recentStudents}
            onRowClick={openStudentDetails}
          />
        </div>
      </div>

      <div className="admin-grid admin-grid-3">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Activity Feed</h3>
          </div>
          <div className="activity-feed">
            {adminActivity.map((item) => (
              <div key={item.title} className="activity-item">
                <div>
                  <p className="activity-title">{item.title}</p>
                  <p className="activity-details">{item.details}</p>
                </div>
                <span className="activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            <button className="quick-action-btn" onClick={() => openQuickAction('add-student')}>Add Student</button>
            <button className="quick-action-btn" onClick={() => openQuickAction('add-course')}>Add Course</button>
            <button className="quick-action-btn" onClick={() => openQuickAction('add-instructor')}>Add Instructor</button>
            <button className="quick-action-btn" onClick={() => openQuickAction('create-booking')}>Create Booking</button>
          </div>
        </div>
      </div>

      <Modal open={Boolean(activeModal)} title={modalTitle} onClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </section>
  );
}