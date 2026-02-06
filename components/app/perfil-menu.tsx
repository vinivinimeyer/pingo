'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Settings,
  User,
  Lock,
  Bell,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  Share2,
} from 'lucide-react';
import { Sheet } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Settings, label: 'Configurações', href: '/perfil/configuracoes' },
  { icon: User, label: 'Editar Perfil', href: '/perfil/editar' },
  { icon: Lock, label: 'Privacidade', href: '/perfil/privacidade' },
  { icon: Share2, label: 'Redes Sociais', href: '/perfil/redes-sociais' },
  { icon: Bell, label: 'Notificações', href: '/perfil/notificacoes' },
  { icon: HelpCircle, label: 'Ajuda', href: '/ajuda' },
  { icon: Info, label: 'Sobre', href: '/sobre' },
];

interface PerfilMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: {
    nome: string;
    username: string;
    avatar: string;
  };
}

const defaultUser = {
  nome: 'Karenne Tikt',
  username: '@karenne',
  avatar: '/avatars/marina.jpg',
};

export function PerfilMenu({
  open,
  onOpenChange,
  user = defaultUser,
}: PerfilMenuProps) {
  const handleSair = () => {
    if (window.confirm('Tem certeza que deseja sair da conta?')) {
      onOpenChange(false);
      window.location.href = '/login';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="bottom">
      <div className="max-h-[80vh] overflow-y-auto pb-6">
        <div className="h-1 w-12 rounded-full bg-muted mx-auto mt-3" />
        <div className="px-6 py-4 flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted shrink-0">
            <Image
              src={user.avatar}
              alt={user.nome}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-foreground truncate">{user.nome}</p>
            <p className="text-sm text-muted-foreground truncate">{user.username}</p>
          </div>
        </div>
        <div className="px-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
              >
                <div className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-muted transition-colors">
                  <Icon
                    className="h-5 w-5 text-muted-foreground shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm font-medium text-foreground flex-1">
                    {item.label}
                  </span>
                  <ChevronRight
                    className="h-4 w-4 text-muted-foreground shrink-0"
                    strokeWidth={1.5}
                  />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="px-6 pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleSair}
            className="w-full rounded-full border border-destructive text-destructive px-6 py-3 text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
            Sair da Conta
          </button>
        </div>
      </div>
    </Sheet>
  );
}
