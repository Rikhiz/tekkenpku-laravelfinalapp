import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Error403() {
  return (
    <AppLayout>
      <Head title="403 Forbidden" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
        <h1 className="text-6xl font-bold mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-6">Access Forbidden</h2>
        <p className="mb-6 text-center">
          Kamu tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Kembali ke Home
        </Link>
      </div>
    </AppLayout>
  );
}
