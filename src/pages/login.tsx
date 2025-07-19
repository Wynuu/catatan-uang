// login.tsx - Perbaikan import path
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, TrendingUp, Moon, Sun, DollarSign, BarChart3, PieChart, Coins } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase'; // Perbaikan path import
import { useRouter } from 'next/router';

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  title: string;
  buttonText: string;
  error?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, title, buttonText, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = isDarkMode 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-800';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${themeClasses} relative overflow-hidden`}>
      {/* Background Financial Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-pulse">
          <BarChart3 size={40} className={isDarkMode ? 'text-green-400' : 'text-blue-600'} />
        </div>
        <div className="absolute top-20 right-20 animate-bounce">
          <PieChart size={35} className={isDarkMode ? 'text-yellow-400' : 'text-green-600'} />
        </div>
        <div className="absolute bottom-20 left-20 animate-pulse">
          <DollarSign size={45} className={isDarkMode ? 'text-blue-400' : 'text-purple-600'} />
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce">
          <Coins size={38} className={isDarkMode ? 'text-purple-400' : 'text-yellow-600'} />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-pulse">
          <DollarSign size={30} className={isDarkMode ? 'text-green-400' : 'text-blue-500'} />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce">
          <BarChart3 size={32} className={isDarkMode ? 'text-yellow-400' : 'text-green-500'} />
        </div>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 hover:scale-110 z-10 ${
          isDarkMode 
            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
            : 'bg-slate-800 text-white hover:bg-slate-700'
        }`}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Login Card */}
      <div className={`w-full max-w-md ${
        isDarkMode 
          ? 'bg-slate-800/80 backdrop-blur-xl border-slate-700/50' 
          : 'bg-white/80 backdrop-blur-xl border-white/50'
      } border rounded-2xl shadow-2xl p-8 relative z-10 transition-all duration-500`}>
        
        {/* Animated Logo */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transition-all duration-500 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-green-400 to-blue-500' 
              : 'bg-gradient-to-br from-blue-600 to-green-600'
          }`}>
            <div className="relative">
              <DollarSign 
                size={40} 
                className={`text-white transition-all duration-700 ${
                  isDarkMode ? 'animate-pulse' : ''
                }`} 
              />
              {isDarkMode && (
                <div className="absolute inset-0 animate-spin">
                  <div className="w-9 h-9 border-2 border-white/30 border-t-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {title}
          </h1>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Kelola keuangan Anda dengan mudah
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 focus:ring-blue-500' 
                : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 focus:ring-blue-500'
            } ${isLoading || !email || !password ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                {buttonText}...
              </div>
            ) : (
              buttonText
            )}
          </button>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              className={`text-sm transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Lupa password?
            </button>
          </div>
        </form>

        {/* Demo Note */}
        <div className={`mt-6 p-4 rounded-xl text-xs text-center ${
          isDarkMode 
            ? 'bg-slate-700/50 border border-slate-600 text-gray-300' 
            : 'bg-gray-50 border border-gray-200 text-gray-600'
        }`}>
          <p>Masukkan email dan password untuk masuk ke sistem</p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-30"></div>
      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-green-500 rounded-full animate-bounce opacity-40"></div>
      <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-pulse opacity-50"></div>
    </div>
  );
};

// Login component yang menggunakan AuthForm
export default function Login() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(''); // Clear previous errors
      console.log('Attempting login with:', { email, password: '***' });
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle different Firebase auth errors
      let errorMessage = 'Terjadi kesalahan saat login';
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email tidak terdaftar';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Password salah';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Format email tidak valid';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Akun telah dinonaktifkan';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Terlalu banyak percobaan. Coba lagi nanti';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Tidak ada koneksi internet';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Email atau password tidak valid';
          break;
        case 'auth/api-key-not-valid':
          errorMessage = 'Konfigurasi Firebase tidak valid';
          break;
        default:
          errorMessage = err.message || 'Email atau password tidak valid';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <AuthForm 
      onSubmit={handleLogin} 
      title="Catatan Uang" 
      buttonText="Masuk" 
      error={error} 
    />
  );
}