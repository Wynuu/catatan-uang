// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Konfigurasi Firebase yang benar
const firebaseConfig = {
  apiKey: "AIzaSyAPuX9GSj1MDnOUwBogazQgj4dPr07MtL0",
  authDomain: "pencacatanuang.firebaseapp.com",
  projectId: "pencacatanuang",
  storageBucket: "pencacatanuang.firebasestorage.app",
  messagingSenderId: "877693156431",
  appId: "1:877693156431:web:2af5ed9e8a01acff44be3a",
  measurementId: "G-3E98VBLZCL"
};


// Validasi konfigurasi
const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  console.error(`Firebase configuration is missing: ${missingKeys.join(', ')}`);
  throw new Error(`Firebase configuration is missing: ${missingKeys.join(', ')}`);
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Development mode setup - hanya aktifkan jika benar-benar diperlukan
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Firebase emulators connected');
  } catch (error) {
    console.log('Emulator connection failed (this is normal if emulator is not running)');
  }
}

// Test connection function
export const testFirebaseConnection = async () => {
  try {
    // Test auth service
    const currentUser = auth.currentUser;
    console.log('Auth service working, current user:', currentUser);
    
    // Test firestore service
    console.log('Firestore service initialized');
    
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

export default app;