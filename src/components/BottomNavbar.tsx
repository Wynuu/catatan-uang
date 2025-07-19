// Komponen ini sudah tidak digunakan
// import React from 'react';
// import { useRouter } from 'next/router';
import React from 'react';
import { useRouter } from 'next/router';
import {
  BanknotesIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

export default function BottomNavbar() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    {
      name: 'Pemasukan',
      icon: <ArrowUpIcon className="h-6 w-6" />,
      path: '/income',
      color: 'text-green-500'
    },
    {
      name: 'Dashboard',
      icon: <BanknotesIcon className="h-6 w-6" />,
      path: '/dashboard',
      color: 'text-blue-500'
    },
    {
      name: 'Pengeluaran',
      icon: <ArrowDownIcon className="h-6 w-6" />,
      path: '/expense',
      color: 'text-red-500'
    },
    {
      name: 'Ringkasan',
      icon: <ChartPieIcon className="h-6 w-6" />,
      path: '/summary',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center w-full h-full ${
              currentPath === item.path
                ? `${item.color} border-t-2 border-current`
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
