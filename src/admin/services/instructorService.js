import { db, isFirebaseConfigured } from '../../firebase/firebaseConfig.js';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

const instructorsCollection = isFirebaseConfigured ? collection(db, 'instructors') : null;

const clone = (data) => data.map((item) => ({ ...item }));

function normalizeInstructor(docSnap) {
  const data = docSnap.data();
  return {
    instructor_id: docSnap.id,
    name: data.name ?? '',
    email: data.email ?? '',
    phone: data.phone ?? data.contact ?? '',
    contact: data.contact ?? data.phone ?? '',
    experience: data.experience ?? '',
    assigned_course: data.assigned_course ?? data.assignedCourse ?? '',
    status: data.status ?? 'Active',
  };
}

export async function getInstructors() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured');
  }

  try {
    const snapshot = await getDocs(instructorsCollection);
    return snapshot.docs.map(normalizeInstructor);
  } catch (error) {
    console.error('[instructorService] getInstructors error:', error);
    throw error;
  }
}

export async function addInstructor(instructorData) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured');
  }

  try {
    const data = {
      name: instructorData.name,
      email: instructorData.email,
      phone: instructorData.phone,
      contact: instructorData.phone,
      experience: instructorData.experience,
      assigned_course: instructorData.assigned_course,
      status: instructorData.status ?? 'Active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(instructorsCollection, data);
    return normalizeInstructor({ id: docRef.id, data: () => data });
  } catch (error) {
    console.error('[instructorService] addInstructor error:', error);
    throw error;
  }
}

export async function updateInstructor(instructorData) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured');
  }

  try {
    const instructorId = instructorData.instructor_id;
    const data = {
      name: instructorData.name,
      email: instructorData.email,
      phone: instructorData.phone,
      contact: instructorData.phone,
      experience: instructorData.experience,
      assigned_course: instructorData.assigned_course,
      status: instructorData.status ?? 'Active',
      updatedAt: serverTimestamp(),
    };
    const instructorRef = doc(db, 'instructors', instructorId);
    await updateDoc(instructorRef, data);
    console.log('[instructorService] updateInstructor success:', instructorId);
    return normalizeInstructor({ id: instructorId, data: () => data });
  } catch (error) {
    console.error('[instructorService] updateInstructor error:', error);
    throw error;
  }
}

export async function deleteInstructor(instructorId) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured');
  }

  try {
    const instructorRef = doc(db, 'instructors', instructorId);
    await deleteDoc(instructorRef);
    console.log('[instructorService] deleteInstructor success:', instructorId);
    return { instructor_id: instructorId };
  } catch (error) {
    console.error('[instructorService] deleteInstructor error:', error);
    throw error;
  }
}
