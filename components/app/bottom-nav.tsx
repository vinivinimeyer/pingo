'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, Rss, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/home',
      label: 'Home',
      icon: Home,
      key: 'home',
    },
    {
      href: '/buscar',
      label: 'Buscar',
      icon: Search,
      key: 'buscar',
    },
    {
      href: '/criar-dica',
      label: 'Criar',
      icon: PlusCircle,
      key: 'criar',
      isCentral: true,
    },
    {
      href: '/feed',
      label: 'Feed',
      icon: Rss,
      key: 'feed',
    },
    {
      href: '/perfil',
      label: 'Perfil',
      icon: User,
      key: 'perfil',
    },
  ];

  const isActive = (href: string, key: string) => {
    if (key === 'home') {
      return pathname === '/home' || pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-md safe-area-inset-bottom">
      <div className="flex items-center justify-around px-6 py-3">
        {navItems.map((item) => {
          const active = isActive(item.href, item.key);
          const Icon = item.icon;

          if (item.isCentral) {
            return (
              <Link key={item.key} href={item.href}>
                <button
                  className="-mt-6 h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                  aria-label={item.label}
                >
                  <Icon className="h-6 w-6 text-primary-foreground" strokeWidth={2} />
                </button>
              </Link>
            );
          }

          return (
            <Link key={item.key} href={item.href}>
              <button
                className={cn(
                  'flex flex-col items-center gap-1 transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground'
                )}
                aria-label={item.label}
              >
                <Icon
                  className="h-6 w-6"
                  strokeWidth={active ? 2.2 : 1.5}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
