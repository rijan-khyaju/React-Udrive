export const dashboardStats = [
  { label: 'Total Students', value: '1,420', delta: '+8.2%', icon: '🎓' },
  { label: 'Total Courses', value: '18', delta: '+4.7%', icon: '📚' },
  { label: 'Total Instructors', value: '24', delta: '+2.5%', icon: '👨‍🏫' },
  { label: 'Total Bookings', value: '328', delta: '+12%', icon: '📅' },
  { label: 'Revenue', value: '$86.8K', delta: '+9.1%', icon: '💰' },
];

export const recentBookings = [
  { id: 'BK-1023', student: 'Rita Sharma', course: 'Basic Driving', date: '2026-06-01', payment: 'Paid', status: 'Approved' },
  { id: 'BK-1018', student: 'Suresh K.', course: 'License Prep', date: '2026-06-03', payment: 'Pending', status: 'Pending' },
  { id: 'BK-1015', student: 'Neha Thapa', course: 'Night Driving', date: '2026-06-04', payment: 'Paid', status: 'Completed' },
  { id: 'BK-1011', student: 'Ram Prasad', course: 'Defensive Driving', date: '2026-06-05', payment: 'Paid', status: 'Approved' },
];

export const recentStudents = [
  { name: 'Aditi Rai', course: 'Basic Driving', status: 'Active' },
  { name: 'Anil KC', course: 'License Prep', status: 'Pending' },
  { name: 'Pooja Rana', course: 'Night Driving', status: 'Active' },
  { name: 'Bikash Gurung', course: 'Defensive Driving', status: 'Active' },
];

export const quickActions = [
  { label: 'Add New Student', action: 'students' },
  { label: 'Create Course', action: 'courses' },
  { label: 'Assign Instructor', action: 'instructors' },
  { label: 'Review Bookings', action: 'bookings' },
];

export const activityFeed = [
  { title: 'New student registered', subtitle: 'Kamal Subedi joined Basic Driving', time: '2m ago' },
  { title: 'Booking approved', subtitle: 'BK-1018 changed to Approved', time: '12m ago' },
  { title: 'Course updated', subtitle: 'Night Driving fee updated', time: '45m ago' },
  { title: 'Instructor assigned', subtitle: 'Sita assigned to Defensive Driving', time: '1h ago' },
];

export const studentList = [
  { id: 'ST-001', name: 'Aditi Rai', email: 'aditi.rai@example.com', phone: '+977-9851010101', course: 'Basic Driving', status: 'Active' },
  { id: 'ST-002', name: 'Rajesh Thapa', email: 'rajesh.thapa@example.com', phone: '+977-9841020202', course: 'License Prep', status: 'Pending' },
  { id: 'ST-003', name: 'Mira Khadka', email: 'mira.k@example.com', phone: '+977-9811030303', course: 'Night Driving', status: 'Active' },
  { id: 'ST-004', name: 'Sujan Basnet', email: 'sujan.b@example.com', phone: '+977-9861040404', course: 'Defensive Driving', status: 'Inactive' },
];

export const courseList = [
  { id: 'CR-101', name: 'Basic Driving', duration: '4 Weeks', fee: '$320', students: 84, status: 'Active' },
  { id: 'CR-102', name: 'License Prep', duration: '3 Weeks', fee: '$280', students: 58, status: 'Active' },
  { id: 'CR-103', name: 'Night Driving', duration: '2 Weeks', fee: '$220', students: 31, status: 'Active' },
  { id: 'CR-104', name: 'Defensive Driving', duration: '5 Weeks', fee: '$420', students: 19, status: 'Pending' },
];

export const instructorList = [
  { id: 'IN-01', name: 'Sita Devi', contact: '+977-9841000001', experience: '8 yrs', course: 'License Prep', status: 'Active' },
  { id: 'IN-02', name: 'Ram Bahadur', contact: '+977-9841000002', experience: '10 yrs', course: 'Basic Driving', status: 'Active' },
  { id: 'IN-03', name: 'Hari Prasad', contact: '+977-9841000003', experience: '6 yrs', course: 'Night Driving', status: 'Leave' },
  { id: 'IN-04', name: 'Nisha Shrestha', contact: '+977-9841000004', experience: '7 yrs', course: 'Defensive Driving', status: 'Active' },
];

export const bookingList = [
  { id: 'BK-1023', student: 'Rita Sharma', course: 'Basic Driving', date: '2026-06-01', payment: 'Paid', status: 'Approved' },
  { id: 'BK-1018', student: 'Suresh K.', course: 'License Prep', date: '2026-06-03', payment: 'Pending', status: 'Pending' },
  { id: 'BK-1015', student: 'Neha Thapa', course: 'Night Driving', date: '2026-06-04', payment: 'Paid', status: 'Completed' },
  { id: 'BK-1011', student: 'Ram Prasad', course: 'Defensive Driving', date: '2026-06-05', payment: 'Paid', status: 'Cancelled' },
  { id: 'BK-1006', student: 'Mina Lama', course: 'License Prep', date: '2026-06-07', payment: 'Paid', status: 'Approved' },
];

export const reportCards = [
  { label: 'Registrations', value: '420', change: '+12%' },
  { label: 'Monthly Bookings', value: '198', change: '+8%' },
  { label: 'Revenue', value: '$42.1K', change: '+6%' },
  { label: 'Popular Course', value: 'Basic Driving', change: 'Top' },
];

export const settingsProfile = {
  name: 'ApexDrive Admin',
  email: 'admin@udrive.com.np',
  phone: '+977-9841-000000',
  location: 'Kathmandu, Nepal',
};

export const systemInfo = {
  version: '1.2.8',
  uptime: '24 days',
  apiStatus: 'Operational',
  usersOnline: '42',
};
