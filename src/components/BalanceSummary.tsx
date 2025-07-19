import React from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface BalanceSummaryProps {
  balance: number;
  income: number;
  expense: number;
}

export default function BalanceSummary({ balance, income, expense }: BalanceSummaryProps) {
  const [showBalance, setShowBalance] = React.useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl mb-6"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium opacity-90">Total Saldo</h2>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {showBalance ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="text-3xl font-bold">
          {showBalance ? (
            `Rp ${balance.toLocaleString('id-ID')}`
          ) : (
            '• • • • • •'
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="space-y-1">
            <p className="text-sm opacity-90">Pemasukan</p>
            <p className="text-lg font-semibold text-green-300">
              {showBalance ? `Rp ${income.toLocaleString('id-ID')}` : '• • • • • •'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm opacity-90">Pengeluaran</p>
            <p className="text-lg font-semibold text-red-300">
              {showBalance ? `Rp ${expense.toLocaleString('id-ID')}` : '• • • • • •'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
