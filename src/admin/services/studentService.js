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
    preferred_time: studentData.preferred_time ?? '',
    booking_date: studentData.booking_date ?? '',
    course: studentData.course ?? '',
    emergency_contact: studentData.emergency_contact ?? '',
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
    // 1. Add student to Firestore
    const docRef = await addDoc(studentsCollection, data);
    const newStudent = normalizeStudent(docRef.id, data);
    students = [newStudent, ...students];

    // 2. Find the course to get fee
    const coursesCol = collection(db, 'courses');
    let courseSnapshot = await getDocs(
      query(coursesCol, where('name', '==', studentData.course))
    );
    if (courseSnapshot.size === 0) {
      courseSnapshot = await getDocs(
        query(coursesCol, where('title', '==', studentData.course))
      );
    }

    const courseFee = courseSnapshot.size > 0
      ? Number(
          courseSnapshot.docs[0].data().priceNPR ??
          courseSnapshot.docs[0].data().fee ??
          courseSnapshot.docs[0].data().price ?? 0
        )
      : 0;

    // 3. Create booking record
    const bookingsCol = collection(db, 'bookings');
    await addDoc(bookingsCol, {
      student: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      course: studentData.course,
      booking_date: studentData.booking_date ?? '',
      time: studentData.preferred_time ?? '',
      preferredTime: studentData.preferred_time ?? '',
      booking_status: 'Approved',
      payment_status: 'Paid',
      fee: courseFee,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 4. Increment course student count
    if (courseSnapshot.size > 0) {
      await updateDoc(
        doc(db, 'courses', courseSnapshot.docs[0].id),
        { students: increment(1) }
      );
    }

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
    const studentRef = doc(db, 'students', studentId);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const studentData = studentSnap.data();
      const courseName = studentData.course;

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