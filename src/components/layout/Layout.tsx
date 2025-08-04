import React from 'react';
import { Header } from './Header';
import { ToastProvider } from '../common/ToastProvider';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-luxury">
      <Header />
      <ToastProvider />
      <main>
        {children}
      </main>
    </div>
  );
}