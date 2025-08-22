import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { EventProvider } from '@/context/EventContext';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/context/ThemeContext';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&family=Fira+Code&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'font-body bg-background text-foreground antialiased min-h-screen flex flex-col'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EventProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Toaster />
          </EventProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
