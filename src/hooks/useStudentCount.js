import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/firebaseConfig.js';

export default function useStudentCount() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setError(new Error('Firestore is not configured'));
      return undefined;
    }

    const studentsCollection = collection(db, 'students');
    const unsubscribe = onSnapshot(
      studentsCollection,
      (snapshot) => {
        setCount(snapshot.size);
      },
      (snapshotError) => {
        console.error('[useStudentCount] onSnapshot error:', snapshotError);
        setError(snapshotError);
      }
    );

    return unsubscribe;
  }, []);

  return { count, error };
}
