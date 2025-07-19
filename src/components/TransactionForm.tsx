import React, { useState } from 'react';

interface TransactionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void; // Pastikan onCancel didefinisikan
  initialData?: any;
  categories?: string[]; // Ubah menjadi optional
  type: 'pemasukan' | 'pengeluaran';
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel, categories = ['Gaji', 'Belanja', 'Investasi'], type }) => {
  const [nominal, setNominal] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [kategori, setKategori] = useState('');
  const [nama, setNama] = useState('');
  const [catatan, setCatatan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nominal, tanggal, kategori, nama, catatan, type });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md mx-auto mt-4">
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Nominal {type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}</label>
        <input type="number" className="w-full p-2 border rounded" value={nominal} onChange={e => setNominal(e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Tanggal</label>
        <input type="date" className="w-full p-2 border rounded" value={tanggal} onChange={e => setTanggal(e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Kategori</label>
        <select className="w-full p-2 border rounded" value={kategori} onChange={e => setKategori(e.target.value)} required>
          <option value="">Pilih Kategori</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Nama Transaksi</label>
        <input type="text" className="w-full p-2 border rounded" value={nama} onChange={e => setNama(e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Catatan</label>
        <textarea className="w-full p-2 border rounded" value={catatan} onChange={e => setCatatan(e.target.value)} rows={3}></textarea>
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Simpan Transaksi</button>
      </div>
    </form>
  );
}

export default TransactionForm;
