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
} from 'firebase/firestore';

const coursesCollection = isFirebaseConfigured ? collection(db, 'courses') : null;
let courses = adminCourses.map((course) => ({ ...course }));

const cloneCourses = (data) => data.map((item) => ({ ...item }));

function parseFeeValue(feeInput) {
  if (!feeInput && feeInput !== 0) return '';
  
  // If already a number, return as is
  if (typeof feeInput === 'number') return feeInput;
  
  // If string, strip Rs. prefix and commas and convert to number
  if (typeof feeInput === 'string') {
    const cleaned = feeInput.replace(/[Rs.\s,]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? '' : num;
  }
  
  return '';
}

function formatFee(priceNPR) {
  if (priceNPR === undefined || priceNPR === null || priceNPR === '') {
    return '';
  }

  if (typeof priceNPR === 'number') {
    return `Rs. ${priceNPR.toLocaleString('en-US')}`;
  }

  return String(priceNPR);
}

function normalizeAdminCourse(id, data) {
  const priceNPR = data.priceNPR ?? data.fee ?? data.price;
  const normalizedName = data.name ?? data.course_name ?? data.title ?? 'Untitled Course';
  const normalizedDescription = data.description ?? data.desc ?? '';

  return {
    course_id: id,
    name: normalizedName,
    course_name: data.course_name ?? normalizedName,
    title: data.title ?? normalizedName,
    description: normalizedDescription,
    desc: data.desc ?? normalizedDescription,
    duration: data.duration ?? 'TBD',
    fee: formatFee(priceNPR),
    priceNPR,
    status: data.status ?? 'Active',
    students: data.students ?? data.number_of_students ?? 0,
    number_of_students: data.students ?? data.number_of_students ?? 0,
  };
}

export async function getCourses() {
  if (!isFirebaseConfigured) {
    return cloneCourses(courses);
  }

  try {
    console.log('[courseService] Collection path: "courses"');
    console.log('[courseService] Firebase configured:', isFirebaseConfigured);
    console.log('[courseService] Database instance:', db);

    const snapshot = await getDocs(coursesCollection);
    console.log('[courseService] Raw Firestore snapshot:', snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    const mapped = snapshot.docs.map((docSnap) => {
      const normalized = normalizeAdminCourse(docSnap.id, docSnap.data());
      console.log('[courseService] Normalized course:', { id: docSnap.id, students: normalized.students, priceNPR: normalized.priceNPR, fee: normalized.fee });
      return normalized;
    });
    console.log('[courseService] Mapped courses:', mapped);
    return mapped;
  } catch (error) {
    console.error('[courseService] getCourses error:', error);
    throw error;
  }
}

export async function getCourse(id) {
  if (!isFirebaseConfigured) {
    const existing = courses.find((course) => course.course_id === id);
    if (!existing) {
      throw new Error(`Course not found: ${id}`);
    }
    return { ...existing };
  }

  try {
    const courseRef = doc(db, 'courses', id);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      throw new Error(`Course not found: ${id}`);
    }

    return normalizeAdminCourse(courseSnap.id, courseSnap.data());
  } catch (error) {
    console.error('[courseService] getCourse error:', id, error);
    throw error;
  }
}

export async function createCourse(courseData) {
  const priceValue = courseData.priceNPR ?? courseData.fee ?? courseData.price ?? '';
  const cleanedFeeValue = parseFeeValue(priceValue);
  
  const data = {
    name: courseData.name,
    description: courseData.description,
    duration: courseData.duration,
    priceNPR: cleanedFeeValue,
    price: cleanedFeeValue,
    fee: cleanedFeeValue,
    status: courseData.status ?? 'Active',
    students: courseData.students ?? courseData.number_of_students ?? 0,
    number_of_students: courseData.number_of_students ?? courseData.students ?? 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured) {
    console.log('[courseService] Firebase not configured, using local fallback for createCourse');
    const nextId = `CR-${String(courses.length + 1).padStart(3, '0')}`;
    const newCourse = normalizeAdminCourse(nextId, data);
    courses = [newCourse, ...courses];
    return cloneCourses(courses);
  }

  try {
    console.log('[courseService] Creating course in Firestore:', data);
    const docRef = await addDoc(coursesCollection, data);
    console.log('[courseService] Course created with ID:', docRef.id);
    return normalizeAdminCourse(docRef.id, data);
  } catch (error) {
    console.error('[courseService] createCourse error:', error);
    throw error;
  }
}

export async function updateCourse(id, courseData) {
  const priceValue = courseData.priceNPR ?? courseData.fee ?? courseData.price ?? '';
  console.log('[courseService] updateCourse incoming fields:', { fee: courseData.fee, price: courseData.price, priceNPR: courseData.priceNPR, resolved: priceValue });
  
  // Parse fee value to strip Rs. prefix, commas, and convert to plain number
  const cleanedFeeValue = parseFeeValue(priceValue);
  console.log('[courseService] updateCourse cleaned fee value:', { input: priceValue, output: cleanedFeeValue });
  
  const data = {
    name: courseData.name,
    description: courseData.description,
    duration: courseData.duration,
    priceNPR: cleanedFeeValue,
    price: cleanedFeeValue,
    fee: cleanedFeeValue,
    status: courseData.status ?? 'Active',
    students: courseData.students ?? courseData.number_of_students ?? 0,
    number_of_students: courseData.number_of_students ?? courseData.students ?? 0,
    updatedAt: serverTimestamp(),
  };
  console.log('[courseService] updateCourse writing to Firestore:', { id, data });

  if (!isFirebaseConfigured) {
    console.log('[courseService] Firebase not configured, using local fallback for updateCourse:', id);
    courses = courses.map((course) =>
      course.course_id === id
        ? normalizeAdminCourse(id, { ...course, ...data })
        : course
    );
    return cloneCourses(courses);
  }

  try {
    console.log('[courseService] updateCourse Firestore call:', { id, data });
    const courseRef = doc(db, 'courses', id);
    await updateDoc(courseRef, data);
    console.log('[courseService] Course updated successfully:', id, data);
    return normalizeAdminCourse(id, { ...data, course_id: id });
  } catch (error) {
    console.error('[courseService] updateCourse error:', id, error);
    throw error;
  }
}

export async function deleteCourse(id) {
  if (!isFirebaseConfigured) {
    console.log('[courseService] Firebase not configured, using local fallback for deleteCourse:', id);
    courses = courses.filter((course) => course.course_id !== id);
    return { id };
  }

  try {
    console.log('[courseService] Deleting course from Firestore:', id);
    const courseRef = doc(db, 'courses', id);
    await deleteDoc(courseRef);
    console.log('[courseService] Course deleted:', id);
    return { id };
  } catch (error) {
    console.error('[courseService] deleteCourse error:', id, error);
    throw error;
  }
}
