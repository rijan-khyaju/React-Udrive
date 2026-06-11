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
    const data = await instructorService.addInstructor(instructorData);
    setInstructors(data);
  }

  async function updateInstructor(instructorData) {
    const data = await instructorService.updateInstructor(instructorData);
    setInstructors(data);
  }

  async function deleteInstructor(instructorId) {
    const data = await instructorService.deleteInstructor(instructorId);
    setInstructors(data);
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
