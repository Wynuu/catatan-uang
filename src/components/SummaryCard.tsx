import React from 'react';

interface SummaryCardProps {
  pemasukan: number;
  pengeluaran: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ pemasukan, pengeluaran }) => {
  const saldo = pemasukan - pengeluaran;
  return (
    <div className="flex flex-col md:flex-row gap-4 my-4">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded shadow p-4 text-center">
        <div className="text-gray-500 dark:text-gray-300">Pemasukan</div>
        <div className="text-2xl font-bold text-green-600">Rp {pemasukan.toLocaleString('id-ID')}</div>
      </div>
      <div className="flex-1 bg-white dark:bg-gray-800 rounded shadow p-4 text-center">
        <div className="text-gray-500 dark:text-gray-300">Pengeluaran</div>
        <div className="text-2xl font-bold text-red-600">Rp {pengeluaran.toLocaleString('id-ID')}</div>
      </div>
      <div className="flex-1 bg-white dark:bg-gray-800 rounded shadow p-4 text-center">
        <div className="text-gray-500 dark:text-gray-300">Saldo</div>
        <div className="text-2xl font-bold text-blue-600">Rp {saldo.toLocaleString('id-ID')}</div>
      </div>
    </div>
  );
};

export default SummaryCard;
