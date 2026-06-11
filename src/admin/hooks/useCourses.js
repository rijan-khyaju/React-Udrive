import { useEffect, useState } from 'react';
import * as courseService from '../services/courseService';

export default function useCourses() {
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
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addCourse(courseData) {
    const data = await courseService.addCourse(courseData);
    setCourses(data);
  }

  async function updateCourse(courseData) {
    const data = await courseService.updateCourse(courseData);
    setCourses(data);
  }

  async function deleteCourse(courseId) {
    const data = await courseService.deleteCourse(courseId);
    setCourses(data);
  }

  return {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    refreshCourses: fetchCourses,
  };
}
