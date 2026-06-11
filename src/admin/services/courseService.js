import { adminCourses } from '../data/adminData';

let courses = adminCourses.map((course) => ({ ...course }));

const clone = (data) => data.map((item) => ({ ...item }));

export async function getCourses() {
  return clone(courses);
}

export async function addCourse(courseData) {
  const nextId = `CR-${String(courses.length + 1).padStart(3, '0')}`;
  const newCourse = {
    ...courseData,
    course_id: nextId,
    course_name: courseData.name,
    number_of_students: courseData.number_of_students ?? courseData.students ?? 0,
    students: courseData.students ?? courseData.number_of_students ?? 0,
    status: courseData.status ?? 'Active',
  };
  courses = [newCourse, ...courses];
  return clone(courses);
}

export async function updateCourse(courseData) {
  courses = courses.map((course) =>
    course.course_id === courseData.course_id
      ? {
          ...course,
          ...courseData,
          course_name: courseData.name,
          number_of_students: courseData.number_of_students ?? courseData.students ?? course.number_of_students,
          students: courseData.students ?? courseData.number_of_students ?? course.students,
        }
      : course
  );
  return clone(courses);
}

export async function deleteCourse(courseId) {
  courses = courses.filter((course) => course.course_id !== courseId);
  return clone(courses);
}
