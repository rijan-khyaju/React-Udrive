import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ADMIN_ROLE } from './roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Development placeholder auth state for login flows.
    // Replace this with Firebase Auth state listener when auth is implemented.
    setLoading(false);
  }, []);

  async function signIn(credentials) {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!credentials.email || !credentials.password) {
          setLoading(false);
          reject(new Error('Please enter both email and password.'));
          return;
        }

        const devUser = {
          uid: 'dev-admin',
          displayName: 'Admin User',
          email: credentials.email,
          role: ADMIN_ROLE,
          authenticated: true,
        };

        setUser(devUser);
        setLoading(false);
        resolve(devUser);
      }, 600);
    });
  }

  async function signOut() {
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
