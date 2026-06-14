import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, db } from '../../firebase/firebaseConfig.js';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ADMIN_ROLE } from './roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          if (userData.role === ADMIN_ROLE) {
            setUser({
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || userData.fullName || 'Admin',
              email: firebaseUser.email,
              role: ADMIN_ROLE,
              authenticated: true,
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('[AdminAuth] error:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn({ email, password }) {
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      if (userData.role !== ADMIN_ROLE) {
        await firebaseSignOut(auth);
        setLoading(false);
        throw new Error('Access denied. You are not an admin.');
      }

      const adminUser = {
        uid: credential.user.uid,
        displayName: credential.user.displayName || userData.fullName || 'Admin',
        email: credential.user.email,
        role: ADMIN_ROLE,
        authenticated: true,
      };

      setUser(adminUser);
      setLoading(false);
      return adminUser;
    } catch (error) {
      setLoading(false);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        throw new Error('Invalid email or password.');
      }
      throw error;
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, signIn, signOut, setUser }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}