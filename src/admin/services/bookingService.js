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
    student: data.student ?? data.name ?? '',
    course: data.course ?? '',
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
    
    // Increment student count for the matching course
    if (bookingData.course) {
      try {
        const coursesCollection = collection(db, 'courses');
        
        // Try 'name' field first
        let courseSnapshot = await getDocs(query(coursesCollection, where('name', '==', bookingData.course)));
        
        // If not found, try 'title' field as fallback
        if (courseSnapshot.size === 0) {
          courseSnapshot = await getDocs(query(coursesCollection, where('title', '==', bookingData.course)));
        }
        
        if (courseSnapshot.size > 0) {
          const courseDoc = courseSnapshot.docs[0];
          const courseRef = doc(db, 'courses', courseDoc.id);
          await updateDoc(courseRef, { students: increment(1) });
          console.log('[bookingService] Incremented student count for course:', bookingData.course);
        } else {
          console.warn('[bookingService] Course not found:', bookingData.course);
        }
      } catch (err) {
        console.warn('[bookingService] Could not increment course student count:', err);
      }
    }
    
    return newBooking;
  } catch (error) {
    console.error('[bookingService] addBooking error:', error);
    throw error;
  }
}

export async function updateBookingStatus(bookingId, updates) {
  if (!isFirebaseConfigured) {
    bookings = bookings.map((booking) =>
      booking.booking_id === bookingId ? { ...booking, ...updates } : booking
    );
    return clone(bookings);
  }

  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { ...updates, updatedAt: serverTimestamp() });
    return await getFirestoreBookings();
  } catch (error) {
    console.error('[bookingService] updateBookingStatus error:', bookingId, error);
    throw error;
  }
}
