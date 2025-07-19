import * as XLSX from 'xlsx';
import { Transaction } from '../hooks/useTransactions';

export const exportToExcel = (
  transactions: Transaction[],
  period: 'weekly' | 'monthly' | 'yearly'
) => {
  // Filter transactions based on period
  const now = new Date();
  const filtered = transactions.filter((tx) => {
    const txDate = new Date(tx.tanggal);
    switch (period) {
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= weekAgo;
      case 'monthly':
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      case 'yearly':
        return txDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  // Transform data for Excel
  const data = filtered.map((tx) => ({
    Tanggal: tx.tanggal,
    Nama: tx.nama,
    Kategori: tx.kategori,
    Tipe: tx.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
    Nominal: tx.nominal,
    Catatan: tx.catatan,
  }));

  // Calculate summary
  const summary = filtered.reduce(
    (acc, tx) => {
      if (tx.type === 'pemasukan') acc.totalPemasukan += tx.nominal;
      else acc.totalPengeluaran += tx.nominal;
      return acc;
    },
    { totalPemasukan: 0, totalPengeluaran: 0 }
  );

  // Add summary to data
  data.push(
    {
      Tanggal: '',
      Nama: '',
      Kategori: '',
      Tipe: '',
      Nominal: 0,
      Catatan: '',
    },
    {
      Tanggal: '',
      Nama: 'Ringkasan',
      Kategori: '',
      Tipe: '',
      Nominal: 0,
      Catatan: '',
    },
    {
      Tanggal: '',
      Nama: 'Total Pemasukan',
      Kategori: '',
      Tipe: '',
      Nominal: summary.totalPemasukan,
      Catatan: '',
    },
    {
      Tanggal: '',
      Nama: 'Total Pengeluaran',
      Kategori: '',
      Tipe: '',
      Nominal: summary.totalPengeluaran,
      Catatan: '',
    },
    {
      Tanggal: '',
      Nama: 'Saldo',
      Kategori: '',
      Tipe: '',
      Nominal: summary.totalPemasukan - summary.totalPengeluaran,
      Catatan: '',
    }
  );

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

  // Generate filename based on period
  const date = new Date().toISOString().split('T')[0];
  const filename = `laporan_keuangan_${period}_${date}.xlsx`;

  XLSX.writeFile(wb, filename);
};
