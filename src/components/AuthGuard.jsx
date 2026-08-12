"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '../context/AdminContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isInitialized } = useAdmin();

  useEffect(() => {
    if (isInitialized && !currentUser && pathname !== '/login') {
      router.push('/login');
    }
  }, [currentUser, isInitialized, pathname, router]);

  if (!isInitialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--brand-gold)' }}>
        Loading Command Center...
      </div>
    );
  }

  // If on login page, render children directly without navbar/sidebar
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If not logged in, wait for redirect
  if (!currentUser) {
    return null;
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <main className="page-body">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
