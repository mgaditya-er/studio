import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { EventProvider } from '@/context/EventContext';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'AlbumAce',
  description:
    'Intelligently create and share event albums with AI-powered features.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body bg-background text-foreground antialiased min-h-screen flex flex-col')}>
        <EventProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Toaster />
        </EventProvider>
      </body>
    </html>
  );
}
