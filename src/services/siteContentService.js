import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/firebaseConfig.js';

const homepageHeroDoc = doc(db, 'siteContent', 'homepageHero');

function sectionDoc(sectionId) {
  return doc(db, 'siteContent', sectionId);
}

export async function getHeroContent() {
  return getSectionContent('homepageHero');
}

export async function updateHeroContent(data) {
  return updateSectionContent('homepageHero', data);
}

export async function getSectionContent(sectionId) {
  if (!isFirebaseConfigured) {
    return null;
  }

  try {
    const snapshot = await getDoc(sectionDoc(sectionId));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error('[siteContentService] getSectionContent error:', error);
    return null;
  }
}

export async function updateSectionContent(sectionId, data) {
  if (!isFirebaseConfigured) {
    throw new Error('Firestore is not configured');
  }

  try {
    await setDoc(sectionDoc(sectionId), data, { merge: true });
  } catch (error) {
    console.error('[siteContentService] updateSectionContent error:', error);
    throw error;
  }
}
