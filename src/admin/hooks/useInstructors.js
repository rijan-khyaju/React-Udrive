import { useEffect, useState } from 'react';
import * as instructorService from '../services/instructorService';

export default function useInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  async function fetchInstructors() {
    setLoading(true);
    setError(null);
    try {
      const data = await instructorService.getInstructors();
      setInstructors(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addInstructor(instructorData) {
    await instructorService.addInstructor(instructorData);
    await fetchInstructors();
  }

  async function updateInstructor(instructorData) {
    await instructorService.updateInstructor(instructorData);
    await fetchInstructors();
  }

  async function deleteInstructor(instructorId) {
    await instructorService.deleteInstructor(instructorId);
    await fetchInstructors();
  }

  return {
    instructors,
    loading,
    error,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    refreshInstructors: fetchInstructors,
  };
}
