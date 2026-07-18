'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthChanges, getUserDoc, createUserDoc, signInWithGoogle, logOut } from '@/lib/firebase';
import type { User } from 'firebase/auth';

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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

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
        if (firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
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
    try {
      await signInWithGoogle();
    } catch (e: any) {
      console.log(e);
      if (e.code === 'auth/unauthorized-domain') {
        alert(`Sign in failed: This domain is not authorized.\nPlease add the following domains to your Authorized Domains in Firebase Console (Authentication > Settings > Authorized domains):\n\nais-dev-u7oiflg2wmpmctegdxdcm5-469568007236.europe-west3.run.app\nais-pre-u7oiflg2wmpmctegdxdcm5-469568007236.europe-west3.run.app`);
      } else if (e.code === 'auth/popup-closed-by-user') {
        alert('Sign in popup was closed. If you are experiencing issues within the editor, try opening the app in a new tab by clicking the arrow icon in the top right of the preview window.');
      } else {
        alert(`Sign in failed: ${e.message}. Please make sure Google Sign-in is enabled in the Firebase Console and try opening the app in a new tab.`);
      }
    }
  };

  const signOut = async () => {
    await logOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
