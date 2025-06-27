// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blog Web App',
  description: 'A web application for reading and managing blog posts with role-based access.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the entire application with AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}