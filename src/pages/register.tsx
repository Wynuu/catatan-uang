import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useRouter } from 'next/router';
import AuthForm from '../components/AuthForm';

export default function Register() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return <AuthForm onSubmit={handleRegister} title="Register" buttonText="Register" error={error} />;
}
