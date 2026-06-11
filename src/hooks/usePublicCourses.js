import { useEffect, useState } from 'react';
import * as publicCourseService from '../services/publicCourseService';

export default function usePublicCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError(null);

    try {
      const data = await publicCourseService.getCourses();
      setCourses(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    courses,
    loading,
    error,
    refreshCourses: fetchCourses,
  };
}
