import { adminInstructors } from '../data/adminData';

let instructors = adminInstructors.map((instructor) => ({ ...instructor }));

const clone = (data) => data.map((item) => ({ ...item }));

export async function getInstructors() {
  return clone(instructors);
}

export async function addInstructor(instructorData) {
  const nextId = `IN-${String(instructors.length + 1).padStart(3, '0')}`;
  const newInstructor = { ...instructorData, instructor_id: nextId, contact: instructorData.phone };
  instructors = [newInstructor, ...instructors];
  return clone(instructors);
}

export async function updateInstructor(instructorData) {
  instructors = instructors.map((instructor) =>
    instructor.instructor_id === instructorData.instructor_id
      ? { ...instructorData, contact: instructorData.phone }
      : instructor
  );
  return clone(instructors);
}

export async function deleteInstructor(instructorId) {
  instructors = instructors.filter((instructor) => instructor.instructor_id !== instructorId);
  return clone(instructors);
}
