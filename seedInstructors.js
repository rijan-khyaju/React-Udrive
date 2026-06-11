import dotenv from 'dotenv';
import { db, isFirebaseConfigured } from './src/firebase/firebaseAdminConfig.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';

dotenv.config();

const collectionName = 'instructors';

const instructors = [
  {
    name: 'Sita Sharma',
    contact: '+977 9812345544',
    experience: '6 years',
    assignedCourse: 'Basic Driving',
    status: 'Active',
  },
  {
    name: 'Ramesh Adhikari',
    contact: '+977 9856123344',
    experience: '4 years',
    assignedCourse: 'License Prep',
    status: 'On Leave',
  },
  {
    name: 'Maya Khadka',
    contact: '+977 9805677890',
    experience: '8 years',
    assignedCourse: 'Defensive Driving',
    status: 'Active',
  },
  {
    name: 'Sunil Gurung',
    contact: '+977 9864590123',
    experience: '3 years',
    assignedCourse: 'Night Driving',
    status: 'Inactive',
  },
  {
    name: 'Anita Rai',
    contact: '+977 9845123678',
    experience: '5 years',
    assignedCourse: 'Refresher',
    status: 'Active',
  },
  {
    name: 'Bikash Thapa',
    contact: '+977 9841234567',
    experience: '4 years',
    assignedCourse: 'Basic Driving',
    status: 'Active',
  },
  {
    name: 'Priya Shrestha',
    contact: '+977 9867891234',
    experience: '6 years',
    assignedCourse: 'Defensive Driving',
    status: 'Active',
  },
  {
    name: 'Arun Maharjan',
    contact: '+977 9823456789',
    experience: '2 years',
    assignedCourse: 'Night & Rain Driving',
    status: 'Active',
  },
];

async function seedInstructors() {
  if (!isFirebaseConfigured || !db) {
    console.error('Firebase is not configured. Ensure FIREBASE_* or VITE_FIREBASE_* env variables are set.');
    process.exit(1);
  }

  const instructorsRef = collection(db, collectionName);

  console.log(`Reading existing documents from Firestore collection: ${collectionName}`);
  const existingSnapshot = await getDocs(instructorsRef);
  const existingNames = new Set(
    existingSnapshot.docs
      .map((doc) => doc.data()?.name)
      .filter(Boolean)
  );

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const instructor of instructors) {
    if (!instructor.name) {
      console.warn('Skipping instructor with missing name:', instructor);
      skipped += 1;
      continue;
    }

    if (existingNames.has(instructor.name)) {
      console.log(`Skipping duplicate instructor: "${instructor.name}"`);
      skipped += 1;
      continue;
    }

    try {
      await addDoc(instructorsRef, instructor);
      console.log(`Added instructor: "${instructor.name}"`);
      added += 1;
    } catch (error) {
      console.error(`Failed to add instructor "${instructor.name}":`, error);
      failed += 1;
    }
  }

  console.log('---');
  console.log(`Seed complete. Added: ${added}, Skipped: ${skipped}, Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

seedInstructors().catch((error) => {
  console.error('Seeding script failed:', error);
  process.exit(1);
});
