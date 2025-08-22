'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { LayoutGrid, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-primary"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-2xl font-headline font-bold text-foreground">
            AlbumAce
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {pathname !== '/' && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin">
              <LayoutGrid className="h-5 w-5" />
              <span className="sr-only">Admin Dashboard</span>
            </Link>
          </Button>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
