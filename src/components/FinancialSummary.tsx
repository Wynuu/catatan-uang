import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { Transaction } from '../hooks/useTransactions';

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export default function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const summary = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'pemasukan') acc.income += tx.nominal;
      else acc.expense += tx.nominal;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = summary.income - summary.expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-500 dark:bg-green-600 p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm">Total Pemasukan</p>
            <p className="text-white text-2xl font-bold">
              Rp {summary.income.toLocaleString('id-ID')}
            </p>
          </div>
          <ArrowUpIcon className="h-8 w-8 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-red-500 dark:bg-red-600 p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm">Total Pengeluaran</p>
            <p className="text-white text-2xl font-bold">
              Rp {summary.expense.toLocaleString('id-ID')}
            </p>
          </div>
          <ArrowDownIcon className="h-8 w-8 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-500 dark:bg-blue-600 p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm">Saldo</p>
            <p className="text-white text-2xl font-bold">
              Rp {balance.toLocaleString('id-ID')}
            </p>
          </div>
          <BanknotesIcon className="h-8 w-8 text-white" />
        </div>
      </motion.div>
    </div>
  );
}
