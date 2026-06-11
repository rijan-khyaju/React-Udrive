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
  const normalizedTitle = data.name ?? data.title ?? 'Untitled Course';
  const normalizedDescription = data.description ?? data.desc ?? '';
  const normalizedPrice = data.priceNPR ?? data.price;

  return {
    id,
    tag: data.tag ?? 'General',
    title: normalizedTitle,
    name: normalizedTitle,
    desc: normalizedDescription,
    description: normalizedDescription,
    duration: data.duration ?? 'TBD',
    lessons: data.lessons ?? 'Custom',
    price: formatPrice(normalizedPrice),
    priceNPR: normalizedPrice,
    img: data.imageUrl ?? data.img ?? '',
    status: data.status ?? 'Active',
  };
}

export async function getCourses() {
  if (!isFirebaseConfigured) {
    return fallbackCourses;
  }

  console.log('[publicCourseService] Collection path: "courses"');
  console.log('[publicCourseService] Firebase configured:', isFirebaseConfigured);
  console.log('[publicCourseService] Database instance:', db);
  
  const snapshot = await getDocs(coursesCollection);
  console.log('[publicCourseService] Raw Firestore snapshot:', snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
  const mapped = snapshot.docs.map((doc) => normalizePublicCourse(doc.id, doc.data()));
  console.log('[publicCourseService] Mapped courses:', mapped);
  return mapped;
}
