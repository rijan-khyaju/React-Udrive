import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from './HomePage';
import CoursesPage from './CoursesPage';
import BookingPage from './BookingPage';
import InstructorsPage from './InstructorsPage';
import DashboardPage from './DashboardPage';

export default function Website() {
  const location = useLocation();
  const [page, setPage] = useState(() => location.state?.page || 'home');

  const navigate = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const pages = {
    home: <HomePage setPage={navigate} />,
    courses: <CoursesPage setPage={navigate} />,
    booking: <BookingPage />,
    instructors: <InstructorsPage setPage={navigate} />,
    dashboard: <DashboardPage />,
  };

  return (
    <>
      <Navbar page={page} setPage={navigate} />
      {pages[page]}
      {page !== 'dashboard' && <Footer setPage={navigate} />}
    </>
  );
}
