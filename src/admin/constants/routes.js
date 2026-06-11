export const adminRoutes = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { label: 'Students', path: '/admin/students', icon: '🧑‍🎓' },
  { label: 'Courses', path: '/admin/courses', icon: '📚' },
  { label: 'Instructors', path: '/admin/instructors', icon: '👨‍🏫' },
  { label: 'Bookings', path: '/admin/bookings', icon: '📅' },
  { label: 'Reports', path: '/admin/reports', icon: '📈' },
  { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
];

export const adminRouteTitles = adminRoutes.reduce((acc, route) => {
  acc[route.path] = route.label;
  return acc;
}, {});
