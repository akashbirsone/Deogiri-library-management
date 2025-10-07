import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/contexts/app-provider';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Deogiri e-Granthalaya',
  description: 'A modern library management system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-muted/50">
        {/* The AppProvider wraps the entire application, providing global access 
            to authentication state and functions. */}
        <Suspense>
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
