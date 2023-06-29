import { Suspense } from 'react';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import Providers from '@/components/providers';
import Toaster from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import '@/styles/globals.css'
import { Inter } from 'next/font/google';
import * as config from '@/config';
import ScrollToTop from '@/components/scroll-to-top';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: config.title,
  description: config.description,
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html lang='en' className={cn('antialiased light')}>
      <body className={cn('min-h-screen pt-12', inter.className)}>
        <Providers >
        <Suspense>
          <Navbar />
        </Suspense>

        {authModal}

        <div className="container max-w-7xl mx-auto">
          {children}
        </div>
        <Suspense>
          <Footer />
        </Suspense>
        <Suspense>
          <ScrollToTop />  
        </Suspense>       
        </Providers>
        <Toaster />
      </body>
    </html>
  );
};
