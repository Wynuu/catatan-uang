import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface Transaction {
  id?: string;
  userId: string;
  nominal: number;
  tanggal: string;
  kategori: string;
  nama: string;
  catatan?: string;
  type: 'pemasukan' | 'pengeluaran';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export function useTransactions(user: User | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Query dengan error handling yang lebih baik
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsub = onSnapshot(q, 
        (snapshot) => {
          console.log('Snapshot received:', snapshot.size, 'documents');
          
          const data: Transaction[] = snapshot.docs.map((doc) => {
            const docData = doc.data();
            return {
              id: doc.id,
              ...docData,
            } as Transaction;
          });
          
          setTransactions(data);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Error fetching transactions:', error);
          setError(error.message);
          setLoading(false);
          
          // Jika error permission, coba query tanpa orderBy
          if (error.code === 'permission-denied') {
            console.log('Permission denied, trying without orderBy...');
            const simpleQuery = query(
              collection(db, 'transactions'),
              where('userId', '==', user.uid)
            );
            
            const fallbackUnsub = onSnapshot(simpleQuery, 
              (snapshot) => {
                const data: Transaction[] = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                })) as Transaction[];
                
                // Sort manually
                data.sort((a, b) => {
                  const aTime = a.createdAt?.toDate() || new Date();
                  const bTime = b.createdAt?.toDate() || new Date();
                  return bTime.getTime() - aTime.getTime();
                });
                
                setTransactions(data);
                setLoading(false);
                setError(null);
              },
              (fallbackError) => {
                console.error('Fallback query also failed:', fallbackError);
                setError(fallbackError.message);
                setLoading(false);
              }
            );
            
            return () => fallbackUnsub();
          }
        }
      );

      return () => unsub();
    } catch (error) {
      console.error('Error setting up listener:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setLoading(false);
    }
  }, [user]);

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) throw new Error('User not logged in');
    
    try {
      const now = new Date();
      const transactionData = {
        ...tx,
        userId: user.uid,
        nominal: Number(tx.nominal),
        tanggal: tx.tanggal || now.toISOString().split('T')[0],
        catatan: tx.catatan || '',
        createdAt: serverTimestamp(), // Gunakan serverTimestamp
        updatedAt: serverTimestamp(),
      };

      console.log('Adding transaction:', transactionData);
      
      const docRef = await addDoc(collection(db, 'transactions'), transactionData);
      console.log('Transaction added with ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, tx: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) throw new Error('User not logged in');
    
    try {
      const docRef = doc(db, 'transactions', id);
      const updateData = {
        ...tx,
        nominal: Number(tx.nominal),
        updatedAt: serverTimestamp(),
      };

      console.log('Updating transaction:', id, updateData);
      
      await updateDoc(docRef, updateData);
      console.log('Transaction updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) throw new Error('User not logged in');
    
    try {
      const docRef = doc(db, 'transactions', id);
      await deleteDoc(docRef);
      console.log('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  return { 
    transactions, 
    loading, 
    error, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  };
}