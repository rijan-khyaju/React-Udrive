import { db, isFirebaseConfigured } from '../../firebase/firebaseConfig.js';
import { adminBookings } from '../data/adminData';
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
  where,
} from 'firebase/firestore';

const bookingsCollection = isFirebaseConfigured ? collection(db, 'bookings') : null;
let bookings = adminBookings.map((booking) => ({ ...booking }));

const clone = (data) => data.map((item) => ({ ...item }));

function normalizeBooking(id, data) {
  return {
    booking_id: id,
    student_name: data.student ?? data.name ?? '',
    student: data.student ?? data.name ?? '',
    course: data.course ?? '',
    fee: data.fee ?? 0,
    booking_date: data.booking_date ?? data.date ?? '',
    time: data.time ?? data.booking_time ?? data.preferredTime ?? '',
    preferredTime: data.preferredTime ?? data.time ?? data.booking_time ?? '',
    payment_status: data.payment_status ?? 'Pending',
    booking_status: data.booking_status ?? 'Pending',
    email: data.email ?? '',
    phone: data.phone ?? '',
    message: data.message ?? '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

async function getFirestoreBookings() {
  const bookingsQuery = query(bookingsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(bookingsQuery);
  return snapshot.docs.map((docSnap) => normalizeBooking(docSnap.id, docSnap.data()));
}

export async function getBookings() {
  if (!isFirebaseConfigured) {
    return clone(bookings);
  }

  try {
    return await getFirestoreBookings();
  } catch (error) {
    console.error('[bookingService] getBookings error:', error);
    throw error;
  }
}

export async function addBooking(bookingData) {
  const data = {
    student: bookingData.student,
    email: bookingData.email,
    phone: bookingData.phone,
    course: bookingData.course,
    fee: bookingData.fee ?? 0,
    booking_date: bookingData.booking_date ?? bookingData.date,
    time: bookingData.time,
    preferredTime: bookingData.time,
    message: bookingData.message,
    booking_status: bookingData.booking_status ?? 'Pending',
    payment_status: bookingData.payment_status ?? 'Pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!isFirebaseConfigured) {
    const nextId = `BK-${String(bookings.length + 1).padStart(3, '0')}`;
    const newBooking = normalizeBooking(nextId, data);
    bookings = [newBooking, ...bookings];
    return newBooking;
  }

  try {
    const docRef = await addDoc(bookingsCollection, data);
    const newBooking = normalizeBooking(docRef.id, data);
    
    
    return newBooking;
  } catch (error) {
    console.error('[bookingService] addBooking error:', error);
    throw error;
  }
}

export async function updateBookingStatus(bookingId, updates, bookingData) {
  if (!isFirebaseConfigured) {
    bookings = bookings.map((booking) =>
      booking.booking_id === bookingId ? { ...booking, ...updates } : booking
    );
    return clone(bookings);
  }

  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const updatesWithFee = { ...updates, updatedAt: serverTimestamp() };
    if (updates.booking_status === 'Approved' && bookingData && bookingData.fee == null && bookingData.course) {
      try {
        const coursesCollection = collection(db, 'courses');
        let courseSnapshot = await getDocs(query(coursesCollection, where('title', '==', bookingData.course)));
        if (courseSnapshot.size === 0) {
          courseSnapshot = await getDocs(query(coursesCollection, where('name', '==', bookingData.course)));
        }
        if (courseSnapshot.size > 0) {
          const courseData = courseSnapshot.docs[0].data();
          const feeFromCourse = courseData.priceNPR ?? courseData.fee ?? courseData.price;
          if (feeFromCourse != null) {
            updatesWithFee.fee = feeFromCourse;
          }
        }
      } catch (err) {
        console.warn('[bookingService] approve fee resolution error:', err);
      }
    }
    await updateDoc(bookingRef, updatesWithFee);

    // Handle approve — add student + increment course count
if (updates.booking_status === 'Approved' && bookingData) {
  try {
    const studentsCollection = collection(db, 'students');
    // Check if student already exists for this booking
    const existingStudent = await getDocs(query(studentsCollection, where('booking_id', '==', bookingId)));
    if (existingStudent.size === 0) {
      await addDoc(studentsCollection, {
        name: bookingData.student,
        email: bookingData.email,
        phone: bookingData.phone,
        course: bookingData.course,
        status: 'Active',
        booking_id: bookingId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Increment course student count
      const coursesCollection = collection(db, 'courses');
      let courseSnapshot = await getDocs(query(coursesCollection, where('title', '==', bookingData.course)));
      if (courseSnapshot.size === 0) {
        courseSnapshot = await getDocs(query(coursesCollection, where('name', '==', bookingData.course)));
      }
      if (courseSnapshot.size > 0) {
        await updateDoc(doc(db, 'courses', courseSnapshot.docs[0].id), { students: increment(1) });
      }
    }
  } catch (err) {
    console.warn('[bookingService] approve side effects error:', err);
  }
}

    // Handle cancel — remove student + decrement course count
    if (updates.booking_status === 'Cancelled' && bookingData) {
      try {
        // Find and delete matching student by booking_id
        const studentsCollection = collection(db, 'students');
        let studentSnapshot = await getDocs(query(studentsCollection, where('booking_id', '==', bookingId)));
if (studentSnapshot.size === 0 && bookingData.email) {
  studentSnapshot = await getDocs(query(studentsCollection, where('email', '==', bookingData.email)));
}
        for (const studentDoc of studentSnapshot.docs) {
          await deleteDoc(doc(db, 'students', studentDoc.id));
        }

        // Decrement course student count
        const coursesCollection = collection(db, 'courses');
        let courseSnapshot = await getDocs(query(coursesCollection, where('title', '==', bookingData.course)));
        if (courseSnapshot.size === 0) {
          courseSnapshot = await getDocs(query(coursesCollection, where('name', '==', bookingData.course)));
        }
        if (courseSnapshot.size > 0) {
          await updateDoc(doc(db, 'courses', courseSnapshot.docs[0].id), { students: increment(-1) });
        }
      } catch (err) {
        console.warn('[bookingService] cancel side effects error:', err);
      }
    }

    return await getFirestoreBookings();
  } catch (error) {
    console.error('[bookingService] updateBookingStatus error:', bookingId, error);
    throw error;
  }
}