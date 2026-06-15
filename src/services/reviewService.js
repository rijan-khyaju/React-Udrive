import { addDoc, collection, getDocs, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig.js';
import { getSectionContent, updateSectionContent } from './siteContentService.js';

export async function submitReview({ uid, name, stars, text }) {
  if (!db) {
    throw new Error('Firestore is not configured');
  }

  const reviewRef = await addDoc(collection(db, 'reviews'), {
    uid,
    name,
    stars,
    text,
    status: 'Pending',
    createdAt: serverTimestamp(),
  });

  return reviewRef;
}

export async function getPendingReviews() {
  if (!db) {
    throw new Error('Firestore is not configured');
  }

  const reviewsRef = collection(db, 'reviews');
  const pendingQuery = query(reviewsRef, where('status', '==', 'Pending'));
  const snapshot = await getDocs(pendingQuery);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function getAverageRating() {
  if (!db) {
    throw new Error('Firestore is not configured');
  }

  const reviewsRef = collection(db, 'reviews');
  const approvedQuery = query(reviewsRef, where('status', '==', 'Approved'));
  const snapshot = await getDocs(approvedQuery);

  const reviewRatings = snapshot.docs
    .map((docSnap) => Number(docSnap.data()?.stars))
    .filter((value) => !Number.isNaN(value) && value >= 0);

  const manualContent = await getSectionContent('homepageTestimonialsList');
  const manualRatings = Array.isArray(manualContent?.items)
    ? manualContent.items
        .map((item) => Number(item?.stars))
        .filter((value) => !Number.isNaN(value) && value >= 0)
    : [];

  const allRatings = [...reviewRatings, ...manualRatings];

  if (allRatings.length === 0) {
    return 0;
  }

  const total = allRatings.reduce((sum, value) => sum + value, 0);
  return Math.round((total / allRatings.length) * 10) / 10;
}

export async function approveReview(review) {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  const reviewDoc = doc(db, 'reviews', review.id);
  await updateDoc(reviewDoc, { status: 'Approved' });

  const existing = await getSectionContent('homepageTestimonialsList');
  const isEmailName = typeof review.name === 'string' && review.name.includes('@');
  const displayName = isEmailName ? 'Anonymous Student' : review.name || 'Student';
  const initials = isEmailName
    ? 'AS'
    : review.name
      ? review.name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0].toUpperCase())
          .join('')
      : 'UD';

  const newItem = {
    id: review.id,
    name: displayName,
    role: 'Verified Student',
    text: review.text,
    stars: review.stars,
    initials,
  };

  const updatedItems = Array.isArray(existing?.items) ? [...existing.items, newItem] : [newItem];
  await updateSectionContent('homepageTestimonialsList', { items: updatedItems });
}

export async function rejectReview(reviewId) {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  const reviewDoc = doc(db, 'reviews', reviewId);
  await updateDoc(reviewDoc, { status: 'Rejected' });
}
