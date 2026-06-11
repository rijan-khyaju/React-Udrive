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
    setLoading(true);
    setError(null);

    try {
      await courseService.createCourse(courseData);
      await fetchCourses();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateCourse(courseId, courseData) {
    setLoading(true);
    setError(null);

    try {
      await courseService.updateCourse(courseId, courseData);
      await fetchCourses();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCourse(courseId) {
    setLoading(true);
    setError(null);

    try {
      await courseService.deleteCourse(courseId);
      await fetchCourses();
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
    addCourse,
    updateCourse,
    deleteCourse,
    refreshCourses: fetchCourses,
  };
}
