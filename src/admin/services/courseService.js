import { db, isFirebaseConfigured } from '../../firebase/firebaseConfig.js';
import { adminCourses } from '../data/adminData';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

const coursesCollection = isFirebaseConfigured ? collection(db, 'courses') : null;
let courses = adminCourses.map((course) => ({ ...course }));

const cloneCourses = (data) => data.map((item) => ({ ...item }));

function formatFee(priceNPR) {
  if (priceNPR === undefined || priceNPR === null) {
    return '';
  }

  if (typeof priceNPR === 'number') {
    return `Rs. ${priceNPR.toLocaleString('en-US')}`;
  }

  return String(priceNPR);
}

function normalizeAdminCourse(id, data) {
  const priceNPR = data.priceNPR ?? data.fee ?? data.price;

  return {
    course_id: id,
    name: data.name ?? data.course_name ?? 'Untitled Course',
    course_name: data.course_name ?? data.name ?? 'Untitled Course',
    description: data.description ?? '',
    duration: data.duration ?? 'TBD',
    fee: formatFee(priceNPR),
    priceNPR,
    status: data.status ?? 'Active',
    students: data.students ?? data.number_of_students ?? 0,
    number_of_students: data.number_of_students ?? data.students ?? 0,
  };
}

export async function getCourses() {
  if (!isFirebaseConfigured) {
    return cloneCourses(courses);
  }

  const coursesQuery = query(coursesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(coursesQuery);
  return snapshot.docs.map((docSnap) => normalizeAdminCourse(docSnap.id, docSnap.data()));
}

export async function getCourse(id) {
  if (!isFirebaseConfigured) {
    const existing = courses.find((course) => course.course_id === id);
    if (!existing) {
      throw new Error(`Course not found: ${id}`);
    }
    return { ...existing };
  }

  const courseRef = doc(db, 'courses', id);
  const courseSnap = await getDoc(courseRef);

  if (!courseSnap.exists()) {
    throw new Error(`Course not found: ${id}`);
  }

  return normalizeAdminCourse(courseSnap.id, courseSnap.data());
}

export async function createCourse(courseData) {
  const data = {
    name: courseData.name,
    description: courseData.description,
    duration: courseData.duration,
    priceNPR: courseData.priceNPR ?? courseData.fee ?? courseData.price ?? '',
    status: courseData.status ?? 'Active',
    students: courseData.students ?? courseData.number_of_students ?? 0,
    number_of_students: courseData.number_of_students ?? courseData.students ?? 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured) {
    const nextId = `CR-${String(courses.length + 1).padStart(3, '0')}`;
    const newCourse = normalizeAdminCourse(nextId, data);
    courses = [newCourse, ...courses];
    return cloneCourses(courses);
  }

  const docRef = await addDoc(coursesCollection, data);
  return normalizeAdminCourse(docRef.id, data);
}

export async function updateCourse(id, courseData) {
  const data = {
    name: courseData.name,
    description: courseData.description,
    duration: courseData.duration,
    priceNPR: courseData.priceNPR ?? courseData.fee ?? courseData.price ?? '',
    status: courseData.status ?? 'Active',
    students: courseData.students ?? courseData.number_of_students ?? 0,
    number_of_students: courseData.number_of_students ?? courseData.students ?? 0,
    updatedAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured) {
    courses = courses.map((course) =>
      course.course_id === id
        ? normalizeAdminCourse(id, { ...course, ...data })
        : course
    );
    return cloneCourses(courses);
  }

  const courseRef = doc(db, 'courses', id);
  await updateDoc(courseRef, data);
  return normalizeAdminCourse(id, data);
}

export async function deleteCourse(id) {
  if (!isFirebaseConfigured) {
    courses = courses.filter((course) => course.course_id !== id);
    return { id };
  }

  const courseRef = doc(db, 'courses', id);
  await deleteDoc(courseRef);
  return { id };
}
