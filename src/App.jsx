import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const [page, setPage] = useState('home');

  const navigate = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const pages = {
    home: <HomePage setPage={navigate} />,
    courses: <CoursesPage setPage={navigate} />,
    booking: <BookingPage />,
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
