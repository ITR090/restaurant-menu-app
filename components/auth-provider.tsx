'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthChanges, getUserDoc, createUserDoc, signInWithGoogle, logOut } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { AuthDialog } from './AuthDialog';

interface AppUser {
  uid: string;
  email: string | null;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  showAuthDialog: false,
  setShowAuthDialog: () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in db
        let userSnap;
        try {
          userSnap = await getUserDoc(firebaseUser.uid);
        } catch (e: any) {
          console.log("Error getting user doc:", e);
          // If we fail to read it, maybe rules are strict?
          // We can proceed assuming no document exists
          userSnap = { exists: () => false, data: () => ({}) } as any;
        }
        
        let role: 'admin' | 'customer' = 'customer';
        if (
          firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || 
          firebaseUser.email === process.env.NEXT_PUBLIC_SECONDARY_ADMIN_EMAIL
        ) {
          role = 'admin';
        }
        if (userSnap.exists()) {
          role = userSnap.data().role as 'admin' | 'customer';
        } else {
          // Attempt to create user doc (will fail for non-admins if rules restrict it, 
          // but for this bootstrapped admin it will work or they can just use the token email rule)
          try {
            await createUserDoc(firebaseUser.uid, role);
          } catch (e) {
            console.log("Failed to create user doc", e);
          }
        }
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setShowAuthDialog(true);
  };

  const signOut = async () => {
    await logOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, showAuthDialog, setShowAuthDialog }}>
      {children}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </AuthContext.Provider>
  );
}
