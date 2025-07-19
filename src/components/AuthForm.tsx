// Simple AuthForm UI for login usage
import React, { useState } from 'react';

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  title?: string;
  buttonText?: string;
  error?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, title = 'Login', buttonText = 'Masuk', error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(email, password);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8 max-w-md mx-auto mt-16 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">{title}</h2>
      {error && <div className="bg-red-500 text-white rounded p-2 mb-4 text-center">{error}</div>}
      <div className="mb-4">
        <label className="block text-slate-300 mb-2">Email</label>
        <input
          type="email"
          className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-slate-300 mb-2">Password</label>
        <input
          type="password"
          className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all"
        disabled={loading}
      >
        {loading ? 'Memproses...' : buttonText}
      </button>
    </form>
  );
};

export default AuthForm;
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from '../utils/firebase';

// Error messages in Indonesian
const getErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'Email tidak terdaftar';
    case 'auth/wrong-password':
      return 'Password salah';
    case 'auth/invalid-email':
      return 'Format email tidak valid';
    case 'auth/user-disabled':
      return 'Akun telah dinonaktifkan';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan login. Coba lagi nanti';
    case 'auth/network-request-failed':
      return 'Koneksi internet bermasalah';
    case 'auth/api-key-not-valid':
      return 'Konfigurasi Firebase tidak valid';
    case 'auth/invalid-credential':
      return 'Email atau password salah';
    case 'auth/email-already-in-use':
      return 'Email sudah digunakan';
    case 'auth/weak-password':
      return 'Password terlalu lemah';
    default:
      console.error('Auth error:', error);
      return 'Terjadi kesalahan. Silakan coba lagi';
  }
};

export const authService = {
  // Login function
  async login(email: string, password: string): Promise<User> {
    try {
      console.log('Attempting login with:', email);
      
      // Validasi input
      if (!email || !password) {
        throw new Error('Email dan password harus diisi');
      }
      
      if (!email.includes('@')) {
        throw new Error('Format email tidak valid');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('auth/')) {
          throw new Error(getErrorMessage(error as AuthError));
        }
        throw error;
      }
      
      throw new Error('Terjadi kesalahan saat login');
    }
  },

  // Register function
  async register(email: string, password: string): Promise<User> {
    try {
      console.log('Attempting registration with:', email);
      
      // Validasi input
      if (!email || !password) {
        throw new Error('Email dan password harus diisi');
      }
      
      if (!email.includes('@')) {
        throw new Error('Format email tidak valid');
      }
      
      if (password.length < 6) {
        throw new Error('Password minimal 6 karakter');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registration successful:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('auth/')) {
          throw new Error(getErrorMessage(error as AuthError));
        }
        throw error;
      }
      
      throw new Error('Terjadi kesalahan saat registrasi');
    }
  },

  // Logout function
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Terjadi kesalahan saat logout');
    }
  },

  // Check if user is logged in
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Test authentication service
  async testAuth(): Promise<boolean> {
    try {
      // Test dengan mencoba mendapatkan current user
      const currentUser = auth.currentUser;
      console.log('Auth service test - Current user:', currentUser);
      return true;
    } catch (error) {
      console.error('Auth service test failed:', error);
      return false;
    }
  }
};