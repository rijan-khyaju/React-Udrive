import { db, isFirebaseConfigured } from '../firebase/firebaseConfig.js';
import { courses as fallbackCourses } from '../data';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const coursesCollection = isFirebaseConfigured ? collection(db, 'courses') : null;

function formatPrice(priceNPR) {
  if (priceNPR === undefined || priceNPR === null) {
    return '';
  }

  if (typeof priceNPR === 'number') {
    return `Rs. ${priceNPR.toLocaleString('en-US')}`;
  }

  return String(priceNPR);
}

function normalizePublicCourse(id, data) {
  return {
    id,
    tag: data.tag ?? 'General',
    title: data.name ?? data.title ?? 'Untitled Course',
    desc: data.description ?? data.desc ?? '',
    duration: data.duration ?? 'TBD',
    lessons: data.lessons ?? 'Custom',
    price: formatPrice(data.priceNPR ?? data.price),
    img: data.imageUrl ?? data.img ?? '',
  };
}

export async function getCourses() {
  if (!isFirebaseConfigured) {
    return fallbackCourses;
  }

  const coursesQuery = query(coursesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(coursesQuery);
  return snapshot.docs.map((doc) => normalizePublicCourse(doc.id, doc.data()));
}
