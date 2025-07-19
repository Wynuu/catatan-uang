import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  PlusCircle,
  MinusCircle,
  PieChart as ChartPieIcon,
  Download,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Sun,
  Moon,
  DollarSign,
  CreditCard,
  Wallet,
} from 'lucide-react';
import { exportToExcel } from '../utils/excel';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];

export default function Dashboard() {
  const { user } = useAuth();
  const { transactions, loading, addTransaction, deleteTransaction, updateTransaction } = useTransactions(user);
  const [activeTab, setActiveTab] = useState('home');
  const [showBalance, setShowBalance] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('pemasukan');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [summaryPeriod, setSummaryPeriod] = useState('monthly');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleExport = (period) => {
    exportToExcel(transactions, period);
  };

  // Calculate financial summary
  const financialSummary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.nominal, 0);
    const expense = transactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.nominal, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  // Prepare chart data
  const pieData = useMemo(() => {
    const categoryData = {};
    transactions.forEach(t => {
      if (!categoryData[t.kategori]) {
        categoryData[t.kategori] = { name: t.kategori, value: 0, type: t.type };
      }
      categoryData[t.kategori].value += t.nominal;
    });
    return Object.values(categoryData);
  }, [transactions]);

  const handleAddTransaction = async (data) => {
    try {
      await addTransaction({ ...data, type: formType });
      setShowForm(false);
      toast.success('Transaksi berhasil ditambahkan!');
    } catch (error) {
      toast.error('Gagal menambah transaksi');
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      toast.success('Transaksi berhasil dihapus!');
    } catch (error) {
      toast.error('Gagal menghapus transaksi');
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setFormType(transaction.type);
    setShowForm(true);
  };

  const handleUpdateTransaction = async (data) => {
    try {
      await updateTransaction(editingTransaction.id, { ...data, type: formType });
      setEditingTransaction(null);
      setShowForm(false);
      toast.success('Transaksi berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui transaksi');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const themeClasses = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
      : 'bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50',
    header: isDarkMode 
      ? 'bg-slate-800/50 backdrop-blur-sm border-b border-slate-700' 
      : 'bg-white/80 backdrop-blur-sm border-b border-green-200',
    headerText: isDarkMode ? 'text-white' : 'text-slate-800',
    headerSubtext: isDarkMode ? 'text-slate-400' : 'text-slate-600',
    card: isDarkMode 
      ? 'bg-slate-800 border border-slate-700' 
      : 'bg-white border border-green-200 shadow-lg',
    cardText: isDarkMode ? 'text-white' : 'text-slate-800',
    cardSubtext: isDarkMode ? 'text-slate-400' : 'text-slate-600',
    input: isDarkMode 
      ? 'bg-slate-700 text-white border-slate-600' 
      : 'bg-white text-slate-800 border-green-200',
    bottomNav: isDarkMode 
      ? 'bg-slate-800 border-t border-slate-700' 
      : 'bg-white border-t border-green-200',
    transactionCard: isDarkMode 
      ? 'bg-slate-700' 
      : 'bg-green-50',
  };

  const TransactionForm = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = useState({
      nama: initialData?.nama || '',
      kategori: initialData?.kategori || '',
      nominal: initialData?.nominal || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.nama && formData.kategori && formData.nominal) {
        onSubmit({
          ...formData,
          nominal: parseInt(formData.nominal),
          type: formType
        });
      }
    };

    return (
      <div className={`${themeClasses.card} rounded-2xl p-6 mb-6`}>
        <h3 className={`text-xl font-semibold ${themeClasses.cardText} mb-4`}>
          {initialData ? 'Edit Transaksi' : `Tambah ${formType === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.cardSubtext} mb-2`}>Nama Transaksi</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
              className={`w-full ${themeClasses.input} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeClasses.cardSubtext} mb-2`}>Kategori</label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData({...formData, kategori: e.target.value})}
              className={`w-full ${themeClasses.input} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Pilih Kategori</option>
              {formType === 'pemasukan' ? (
                <>
                  <option value="Gaji">Gaji</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Investasi">Investasi</option>
                </>
              ) : (
                <>
                  <option value="Makanan">Makanan</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Utilitas">Utilitas</option>
                  <option value="Hiburan">Hiburan</option>
                  <option value="Belanja">Belanja</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeClasses.cardSubtext} mb-2`}>Nominal</label>
            <input
              type="number"
              value={formData.nominal}
              onChange={(e) => setFormData({...formData, nominal: e.target.value})}
              className={`w-full ${themeClasses.input} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all"
          >
            {initialData ? 'Update' : 'Simpan'}
          </button>
          <button
            onClick={onCancel}
            className={`flex-1 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} ${themeClasses.cardText} py-3 rounded-lg font-medium transition-colors`}
          >
            Batal
          </button>
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
        {/* Financial pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-6xl">₹</div>
          <div className="absolute bottom-4 left-4 text-4xl">$</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">💰</div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-emerald-100 text-sm flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Total Saldo
              </p>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">
                  {showBalance ? formatCurrency(financialSummary.balance) : '••••••••'}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-emerald-100 hover:text-white transition-colors"
                >
                  {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="h-4 w-4 text-emerald-300" />
                <p className="text-emerald-100 text-sm">Pemasukan</p>
              </div>
              <p className="text-lg font-semibold">
                {showBalance ? formatCurrency(financialSummary.income) : '••••••••'}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDown className="h-4 w-4 text-red-300" />
                <p className="text-red-100 text-sm">Pengeluaran</p>
              </div>
              <p className="text-lg font-semibold">
                {showBalance ? formatCurrency(financialSummary.expense) : '••••••••'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            setFormType('pemasukan');
            setShowForm(true);
            setEditingTransaction(null);
          }}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-xl flex items-center gap-3 shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
        >
          <PlusCircle className="h-8 w-8" />
          <div className="text-left">
            <p className="font-semibold">Pemasukan</p>
            <p className="text-sm text-emerald-100">Tambah pemasukan</p>
          </div>
        </button>
        
        <button
          onClick={() => {
            setFormType('pengeluaran');
            setShowForm(true);
            setEditingTransaction(null);
          }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl flex items-center gap-3 shadow-lg hover:from-red-600 hover:to-red-700 transition-all"
        >
          <MinusCircle className="h-8 w-8" />
          <div className="text-left">
            <p className="font-semibold">Pengeluaran</p>
            <p className="text-sm text-red-100">Tambah pengeluaran</p>
          </div>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className={`${themeClasses.card} rounded-2xl p-6`}>
        <h3 className={`text-xl font-semibold ${themeClasses.cardText} mb-4`}>Transaksi Terbaru</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className={`flex items-center justify-between p-3 ${themeClasses.transactionCard} rounded-lg`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'pemasukan' ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {transaction.type === 'pemasukan' ? 
                    <ArrowUp className="h-5 w-5 text-white" /> : 
                    <ArrowDown className="h-5 w-5 text-white" />
                  }
                </div>
                <div>
                  <p className={`${themeClasses.cardText} font-medium`}>{transaction.nama}</p>
                  <p className={`${themeClasses.cardSubtext} text-sm`}>{transaction.kategori}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'pemasukan' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'pemasukan' ? '+' : '-'}{formatCurrency(transaction.nominal)}
                </p>
                <p className={`${themeClasses.cardSubtext} text-sm`}>{new Date(transaction.tanggal).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className={`${themeClasses.card} rounded-2xl p-6`}>
        <h3 className={`text-xl font-semibold ${themeClasses.cardText} mb-4`}>Semua Transaksi</h3>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className={`flex items-center justify-between p-3 ${themeClasses.transactionCard} rounded-lg`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'pemasukan' ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {transaction.type === 'pemasukan' ? 
                    <ArrowUp className="h-5 w-5 text-white" /> : 
                    <ArrowDown className="h-5 w-5 text-white" />
                  }
                </div>
                <div>
                  <p className={`${themeClasses.cardText} font-medium`}>{transaction.nama}</p>
                  <p className={`${themeClasses.cardSubtext} text-sm`}>{transaction.kategori}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'pemasukan' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'pemasukan' ? '+' : '-'}{formatCurrency(transaction.nominal)}
                  </p>
                  <p className={`${themeClasses.cardSubtext} text-sm`}>{new Date(transaction.tanggal).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTransaction(transaction)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className={`${themeClasses.card} rounded-2xl p-6`}>
        <h3 className={`text-xl font-semibold ${themeClasses.cardText} mb-4`}>Ringkasan Keuangan</h3>
        <div className="flex gap-2 mb-6">
          {['weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setSummaryPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                summaryPeriod === period 
                  ? 'bg-blue-500 text-white' 
                  : isDarkMode 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Tahunan'}
            </button>
          ))}
        </div>

        {/* Pie Chart */}
        <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-green-50'} rounded-lg p-4 mb-6`}>
          <h4 className={`text-lg font-semibold ${themeClasses.cardText} mb-4`}>Distribusi Kategori</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => handleExport('weekly')}
            className="bg-emerald-500 text-white py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-5 w-5" />
            <span className="text-sm">Mingguan</span>
          </button>
          
          <button 
            onClick={() => handleExport('monthly')}
            className="bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-5 w-5" />
            <span className="text-sm">Bulanan</span>
          </button>
          
          <button 
            onClick={() => handleExport('yearly')}
            className="bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-5 w-5" />
            <span className="text-sm">Tahunan</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      {/* Header */}
      <div className={themeClasses.header}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-bold ${themeClasses.headerText}`}>Catatan Uang</h1>
              <p className={`${themeClasses.headerSubtext} text-sm`}>Kelola keuangan Anda dengan mudah</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle Button */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900' 
                    : 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
                }`}
              >
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {showForm && (
          <TransactionForm
            onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
            initialData={editingTransaction}
            onCancel={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
          />
        )}
        
        {activeTab === 'home' && renderHome()}
        {activeTab === 'income' && renderTransactions()}
        {activeTab === 'expense' && renderTransactions()}
        {activeTab === 'summary' && renderSummary()}
      </div>

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 ${themeClasses.bottomNav}`}>
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'home' 
                  ? 'text-blue-400 bg-blue-400/10' 
                  : isDarkMode 
                    ? 'text-slate-400 hover:text-slate-300' 
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Wallet className="h-6 w-6" />
              <span className="text-xs font-medium">Beranda</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('income');
                setFormType('pemasukan');
                setShowForm(true);
                setEditingTransaction(null);
              }}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'income' 
                  ? 'text-emerald-400 bg-emerald-400/10' 
                  : isDarkMode 
                    ? 'text-slate-400 hover:text-slate-300' 
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowUp className="h-6 w-6" />
              <span className="text-xs font-medium">Pemasukan</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('expense');
                setFormType('pengeluaran');
                setShowForm(true);
                setEditingTransaction(null);
              }}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'expense' 
                  ? 'text-red-400 bg-red-400/10' 
                  : isDarkMode 
                    ? 'text-slate-400 hover:text-slate-300' 
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowDown className="h-6 w-6" />
              <span className="text-xs font-medium">Pengeluaran</span>
            </button>
            
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'summary' 
                  ? 'text-purple-400 bg-purple-400/10' 
                  : isDarkMode 
                    ? 'text-slate-400 hover:text-slate-300' 
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ChartPieIcon className="h-6 w-6" />
              <span className="text-xs font-medium">Ringkasan</span>
            </button>
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}