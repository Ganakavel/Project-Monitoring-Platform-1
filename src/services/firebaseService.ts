import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';
import { ChatMessage } from '../types';

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
