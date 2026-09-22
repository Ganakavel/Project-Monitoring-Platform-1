import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';
import { ChatMessage } from '../types';

// Export collection names for reuse
export const COL_PROJECTS = 'projects';
export const COL_TASKS = 'tasks';
export const COL_NOTES = 'notes';
export const COL_CALENDAR = 'calendar_events';

/** Generic CRUD helpers for any collection */
export const addEntity = async (col: string, data: any): Promise<boolean> => {
  const { success, db } = initFirebase();
  if (!success || !db) return false;
  try {
    await addDoc(collection(db, col), data);
    return true;
  } catch (e) {
    console.error('addEntity error', e);
    return false;
  }
};

export const setEntity = async (col: string, id: string, data: any): Promise<boolean> => {
  const { success, db } = initFirebase();
  if (!success || !db) return false;
  try {
    await setDoc(doc(db, col, id), data);
    return true;
  } catch (e) {
    console.error('setEntity error', e);
    return false;
  }
};

export const updateEntity = async (col: string, id: string, data: Partial<any>): Promise<boolean> => {
  const { success, db } = initFirebase();
  if (!success || !db) return false;
  try {
    await updateDoc(doc(db, col, id), data);
    return true;
  } catch (e) {
    console.error('updateEntity error', e);
    return false;
  }
};

export const deleteEntity = async (col: string, id: string): Promise<boolean> => {
  const { success, db } = initFirebase();
  if (!success || !db) return false;
  try {
    await deleteDoc(doc(db, col, id));
    return true;
  } catch (e) {
    console.error('deleteEntity error', e);
    return false;
  }
};

export const subscribeToCollection = <T>(col: string, onChange: (items: T[]) => void): Unsubscribe | null => {
  const { success, db } = initFirebase();
  if (!success || !db) return null;
  const q = query(collection(db, col), orderBy('createdAt', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      const items: T[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) } as T));
      onChange(items);
    },
    (err) => console.error('Firestore subscription error', err)
  );
};

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const FIREBASE_STORAGE_KEY = 'nexgen_firebase_config_v1';

// Default / fallback Firebase config from environment variables if set
const envConfig: Partial<FirebaseConfig> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export function getStoredFirebaseConfig(): FirebaseConfig | null {
  try {
    const raw = localStorage.getItem(FIREBASE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved Firebase config', e);
  }

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig as FirebaseConfig;
  }

  return null;
}

export function saveFirebaseConfig(config: FirebaseConfig): void {
  localStorage.setItem(FIREBASE_STORAGE_KEY, JSON.stringify(config));
}

export function clearFirebaseConfig(): void {
  localStorage.removeItem(FIREBASE_STORAGE_KEY);
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

export function initFirebase(): { success: boolean; db: Firestore | null; projectId?: string } {
  const config = getStoredFirebaseConfig();
  if (!config || !config.projectId || !config.apiKey) {
    return { success: false, db: null };
  }

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    firestoreDb = getFirestore(firebaseApp);
    return { success: true, db: firestoreDb, projectId: config.projectId };
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return { success: false, db: null };
  }
}

// ── Real-Time Multi-Device Listener ──────────────────────────────────────────
export function subscribeToFirestoreChat(
  onMessagesChange: (messages: ChatMessage[]) => void
): Unsubscribe | null {
  const { success, db } = initFirebase();
  if (!success || !db) return null;

  try {
    const chatRef = collection(db, 'chat_messages');
    const q = query(chatRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const remoteMessages: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          remoteMessages.push({
            id: doc.id,
            senderId: data.senderId,
            senderName: data.senderName,
            senderAvatar: data.senderAvatar,
            isCurrentUser: false, // will be calculated by UI based on profile
            content: data.content || '',
            timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: data.createdAt || Date.now(),
            attachment: data.attachment || undefined,
          });
        });
        if (remoteMessages.length > 0) {
          onMessagesChange(remoteMessages);
        }
      },
      (error) => {
        console.error('Firestore chat subscription error:', error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up Firestore chat listener:', error);
    return null;
  }
}

// ── Send Message to Firestore Cloud ──────────────────────────────────────────
export async function sendFirestoreChatMessage(message: Omit<ChatMessage, 'id'>): Promise<boolean> {
  const { success, db } = initFirebase();
  if (!success || !db) return false;

  try {
    const chatRef = collection(db, 'chat_messages');
    await addDoc(chatRef, {
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatar: message.senderAvatar,
      content: message.content,
      timestamp: message.timestamp,
      createdAt: message.createdAt || Date.now(),
      attachment: message.attachment || null,
    });
    return true;
  } catch (error) {
    console.error('Error sending Firestore message:', error);
    return false;
  }
}
