import React from 'react';

interface Transaction {
  id: string;
  nominal: number;
  tanggal: string;
  kategori: string;
  nama: string;
  catatan: string;
  type: 'pemasukan' | 'pengeluaran';
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow-md p-4 mt-4 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1">Tanggal</th>
            <th className="px-2 py-1">Kategori</th>
            <th className="px-2 py-1">Nama</th>
            <th className="px-2 py-1">Nominal</th>
            <th className="px-2 py-1">Catatan</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id} className={tx.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'}>
              <td className="px-2 py-1 whitespace-nowrap">{tx.tanggal}</td>
              <td className="px-2 py-1 whitespace-nowrap">{tx.kategori}</td>
              <td className="px-2 py-1 whitespace-nowrap">{tx.nama}</td>
              <td className="px-2 py-1 whitespace-nowrap">{tx.nominal.toLocaleString('id-ID')}</td>
              <td className="px-2 py-1 whitespace-nowrap">{tx.catatan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
