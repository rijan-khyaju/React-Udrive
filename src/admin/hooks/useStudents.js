import { useEffect, useState } from 'react';
import * as studentService from '../services/studentService';

export default function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addStudent(studentData) {
    const data = await studentService.addStudent(studentData);
    setStudents(data);
  }

  async function updateStudent(studentData) {
    const data = await studentService.updateStudent(studentData);
    setStudents(data);
  }

  async function deleteStudent(studentId) {
    const data = await studentService.deleteStudent(studentId);
    setStudents(data);
  }

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents: fetchStudents,
  };
}
