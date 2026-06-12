import { db, isFirebaseConfigured } from '../../firebase/firebaseConfig.js';
import { adminStudents } from '../data/adminData';
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
  where,
} from 'firebase/firestore';

const studentsCollection = isFirebaseConfigured ? collection(db, 'students') : null;
let students = adminStudents.map((student) => ({ ...student }));

const clone = (data) => data.map((item) => ({ ...item }));

function normalizeStudent(id, data) {
  return {
    student_id: id,
    name: data.name ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    address: data.address ?? '',
    gender: data.gender ?? 'Female',
    dob: data.dob ?? '',
    course: data.course ?? '',
    emergency_contact: data.emergency_contact ?? data.emergencyContact ?? '',
    status: data.status ?? 'Active',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

async function getFirestoreStudents() {
  const studentsQuery = query(studentsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(studentsQuery);
  return snapshot.docs.map((docSnap) => normalizeStudent(docSnap.id, docSnap.data()));
}

export async function getStudents() {
  if (!isFirebaseConfigured) {
    return clone(students);
  }

  try {
    return await getFirestoreStudents();
  } catch (error) {
    console.error('[studentService] getStudents error:', error);
    throw error;
  }
}

export async function addStudent(studentData) {
  const data = {
    name: studentData.name,
    email: studentData.email,
    phone: studentData.phone,
    address: studentData.address ?? '',
    gender: studentData.gender ?? 'Female',
    dob: studentData.dob ?? '',
    course: studentData.course ?? '',
    emergency_contact: studentData.emergency_contact ?? studentData.emergencyContact ?? '',
    status: studentData.status ?? 'Active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured) {
    const nextId = `ST-${String(students.length + 1).padStart(3, '0')}`;
    const newStudent = normalizeStudent(nextId, data);
    students = [newStudent, ...students];
    return clone(students);
  }

  try {
    const docRef = await addDoc(studentsCollection, data);
    const newStudent = normalizeStudent(docRef.id, data);
    students = [newStudent, ...students];
    return await getFirestoreStudents();
  } catch (error) {
    console.error('[studentService] addStudent error:', error);
    throw error;
  }
}

export async function updateStudent(studentData) {
  if (!isFirebaseConfigured) {
    students = students.map((student) =>
      student.student_id === studentData.student_id ? { ...studentData } : student
    );
    return clone(students);
  }

  try {
    const studentRef = doc(db, 'students', studentData.student_id);
    await updateDoc(studentRef, {
      ...studentData,
      updatedAt: serverTimestamp(),
    });
    return await getFirestoreStudents();
  } catch (error) {
    console.error('[studentService] updateStudent error:', studentData.student_id, error);
    throw error;
  }
}

export async function deleteStudent(studentId) {
  if (!isFirebaseConfigured) {
    students = students.filter((student) => student.student_id !== studentId);
    return clone(students);
  }

  try {
    // Get student data before deleting to find their course
    const studentRef = doc(db, 'students', studentId);
    const studentSnap = await getDoc(studentRef);
    
    if (studentSnap.exists()) {
      const studentData = studentSnap.data();
      const courseName = studentData.course;
      
      // Decrement course student count
      if (courseName) {
        const coursesCol = collection(db, 'courses');
        let courseSnapshot = await getDocs(query(coursesCol, where('title', '==', courseName)));
        if (courseSnapshot.size === 0) {
          courseSnapshot = await getDocs(query(coursesCol, where('name', '==', courseName)));
        }
        if (courseSnapshot.size > 0) {
          await updateDoc(doc(db, 'courses', courseSnapshot.docs[0].id), { students: increment(-1) });
        }
      }
    }
    
    await deleteDoc(studentRef);
    return await getFirestoreStudents();
  } catch (error) {
    console.error('[studentService] deleteStudent error:', studentId, error);
    throw error;
  }
}
