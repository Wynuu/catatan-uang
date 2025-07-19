// Komponen ini sudah tidak digunakan
// import React from 'react';
// import Link from 'next/link';
import React from 'react';
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-blue-600 dark:bg-blue-900 text-white">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="font-bold text-lg">Catatan Uang</Link>
      </div>
      <div className="flex items-center gap-2">
        <DarkModeToggle />
      </div>
    </nav>
  );
}
