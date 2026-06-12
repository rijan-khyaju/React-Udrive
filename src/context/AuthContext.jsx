import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import * as firebaseAuth from '../firebase/auth.js';

const AuthContext = createContext({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await firebaseAuth.getUserProfile(firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || profile?.fullName || '',
          phone: profile?.phone || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp: firebaseAuth.signUp,
      signIn: firebaseAuth.signIn,
      signOut: firebaseAuth.signOut,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function PublicAuthProvider() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
