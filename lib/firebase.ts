import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, serverTimestamp, updateDoc, getDoc, deleteDoc, query, where, orderBy, writeBatch } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);

// Data Types
export interface Category {
  id: string;
  name: string;
  order?: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface AboutInfo {
  name: string;
  phone: string;
  location: string;
}

// Data Methods
export async function getCategories(): Promise<Category[]> {
  const snap = await getDocs(collection(db, 'categories'));
  const categories = snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  return categories.sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999));
}

export async function addCategory(name: string): Promise<void> {
  await addDoc(collection(db, 'categories'), {
    name,
    createdAt: serverTimestamp()
  });
}

export async function updateCategory(id: string, name: string): Promise<void> {
  await updateDoc(doc(db, 'categories', id), {
    name,
    updatedAt: serverTimestamp()
  });
}

export async function getMenuItems(categoryId?: string): Promise<MenuItem[]> {
  const snap = await getDocs(collection(db, 'menuItems'));
  let items = snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem));
  if (categoryId) {
    items = items.filter(i => i.categoryId === categoryId);
  }
  return items;
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<void> {
  await addDoc(collection(db, 'menuItems'), {
    ...item,
    createdAt: serverTimestamp()
  });
}

export async function updateMenuItem(id: string, item: Partial<Omit<MenuItem, 'id'>>): Promise<void> {
  await updateDoc(doc(db, 'menuItems', id), {
    ...item,
    updatedAt: serverTimestamp()
  });
}

export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'menuItems', id));
}

export async function getAboutInfo(): Promise<AboutInfo | null> {
  const docSnap = await getDoc(doc(db, 'settings', 'restaurantInfo'));
  if (docSnap.exists()) {
    return docSnap.data() as AboutInfo;
  }
  return null;
}

export async function saveAboutInfo(info: AboutInfo): Promise<void> {
  await setDoc(doc(db, 'settings', 'restaurantInfo'), {
    ...info,
    updatedAt: serverTimestamp()
  });
}

// Auth Methods
export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserDoc(uid: string) {
  return await getDoc(doc(db, 'users', uid));
}

export async function createUserDoc(uid: string, role: string) {
  await setDoc(doc(db, 'users', uid), {
    role,
    createdAt: serverTimestamp()
  });
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

export async function signInWithEmail(email: string, pass: string) {
  return await signInWithEmailAndPassword(auth, email, pass);
}

export async function signUpWithEmail(email: string, pass: string) {
  return await createUserWithEmailAndPassword(auth, email, pass);
}

export async function logOut() {
  return await firebaseSignOut(auth);
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
}

export interface OrderWithId extends Order {
  id: string;
  createdAt: any;
}

export async function createOrder(order: Order): Promise<string> {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function getUserOrders(userId: string): Promise<OrderWithId[]> {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    // Order by is omitted to avoid requiring a composite index right away, 
    // or we can sort client side since the rules don't mandate it.
  );
  const snap = await getDocs(q);
  const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as OrderWithId));
  // sort by createdAt descending client side
  return orders.sort((a, b) => {
    const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return bTime - aTime;
  });
}


export async function updateCategoriesOrder(categories: {id: string, order: number}[]): Promise<void> {
  const batch = writeBatch(db);
  for (const cat of categories) {
    batch.update(doc(db, 'categories', cat.id), {
      order: cat.order,
      updatedAt: serverTimestamp()
    });
  }
  await batch.commit();
}

export interface Reservation {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: any;
}

export async function createReservation(reservation: Reservation): Promise<string> {
  const docRef = await addDoc(collection(db, 'reservations'), {
    ...reservation,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
