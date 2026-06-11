import { adminStudents } from '../data/adminData';

let students = adminStudents.map((student) => ({ ...student }));

const clone = (data) => data.map((item) => ({ ...item }));

export async function getStudents() {
  return clone(students);
}

export async function addStudent(studentData) {
  const nextId = `ST-${String(students.length + 1).padStart(3, '0')}`;
  const newStudent = { ...studentData, student_id: nextId, status: 'Active' };
  students = [newStudent, ...students];
  return clone(students);
}

export async function updateStudent(studentData) {
  students = students.map((student) =>
    student.student_id === studentData.student_id ? { ...studentData } : student
  );
  return clone(students);
}

export async function deleteStudent(studentId) {
  students = students.filter((student) => student.student_id !== studentId);
  return clone(students);
}
