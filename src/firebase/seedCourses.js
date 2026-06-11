import { db } from './firebaseAdminConfig.js';
import { courses } from '../data/index.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const collectionName = 'courses';

async function seedCourses() {
  if (!db) {
    console.error('Firebase is not configured. Ensure FIREBASE_* or VITE_FIREBASE_* env variables are available when running this script.');
    process.exit(1);
  }

  const coursesRef = collection(db, collectionName);

  console.log(`Reading existing documents from Firestore collection: ${collectionName}`);
  const existingSnapshot = await getDocs(coursesRef);
  const existingTitles = new Set(
    existingSnapshot.docs
      .map((doc) => doc.data()?.title)
      .filter(Boolean)
  );

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const course of courses) {
    if (!course?.title) {
      console.warn('Skipping course with missing title:', course);
      skipped += 1;
      continue;
    }

    if (existingTitles.has(course.title)) {
      console.log(`Skipping duplicate course: "${course.title}"`);
      skipped += 1;
      continue;
    }

    try {
      await addDoc(coursesRef, course);
      console.log(`Added course: "${course.title}"`);
      added += 1;
    } catch (error) {
      console.error(`Failed to add course "${course.title}":`, error);
      failed += 1;
    }
  }

  console.log('---');
  console.log(`Seed complete. Added: ${added}, Skipped: ${skipped}, Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

seedCourses().catch((error) => {
  console.error('Seeding script failed:', error);
  process.exit(1);
});
