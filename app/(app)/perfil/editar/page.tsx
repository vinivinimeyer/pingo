'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Camera } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const mockUser = {
  nome: 'Karenne Tikt',
  username: 'karenne',
  bio: 'Exploradora de praias 🏖️',
  localizacao: 'São Paulo, SP',
  capa: '/images/guia1.jpg',
  avatar: '/avatars/marina.jpg',
  instagram: '',
  facebook: '',
  twitter: '',
  perfilPrivado: false,
  mostrarLocalizacao: true,
};

export default function EditarPerfilPage() {
  const [nome, setNome] = useState(mockUser.nome);
  const [username, setUsername] = useState(mockUser.username);
  const [bio, setBio] = useState(mockUser.bio);
  const [localizacao, setLocalizacao] = useState(mockUser.localizacao);
  const [capa, setCapa] = useState(mockUser.capa);
  const [avatar, setAvatar] = useState(mockUser.avatar);
  const [instagram, setInstagram] = useState(mockUser.instagram);
  const [facebook, setFacebook] = useState(mockUser.facebook);
  const [twitter, setTwitter] = useState(mockUser.twitter);
  const [perfilPrivado, setPerfilPrivado] = useState(mockUser.perfilPrivado);
  const [mostrarLocalizacao, setMostrarLocalizacao] = useState(
    mockUser.mostrarLocalizacao
  );
  const [saved, setSaved] = useState(false);
  const capaInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleCapaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCapa(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges =
    nome !== mockUser.nome ||
    username !== mockUser.username ||
    bio !== mockUser.bio ||
    localizacao !== mockUser.localizacao;

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/perfil"
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Editar Perfil</h1>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            className="text-sm font-medium text-accent disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Fotos */}
        <div>
          <div
            className="relative aspect-[3/1] rounded-2xl overflow-hidden bg-muted cursor-pointer"
            onClick={() => capaInputRef.current?.click()}
          >
            {capa ? (
              <img src={capa} alt="Capa" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Adicionar capa
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 opacity-0 hover:opacity-100 transition-opacity">
              <span className="rounded-full bg-card px-4 py-2 text-sm font-medium">
                Alterar capa
              </span>
            </div>
            <input
              ref={capaInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleCapaChange}
            />
          </div>
          <div className="flex justify-center -mt-12 relative z-10">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="relative h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-muted"
            >
              <Image
                src={avatar}
                alt="Avatar"
                fill
                className="object-cover"
                sizes="96px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/50 opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-primary-foreground" strokeWidth={1.5} />
              </div>
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Dados básicos */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome completo
            </label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-xl border-2 border-[#F0C05A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                @
              </span>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-8 rounded-xl border-2 border-[#F0C05A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              className="w-full rounded-2xl border-2 border-[#F0C05A] bg-card px-4 py-3 text-sm min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {bio.length}/150
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Localização
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              <Input
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className="pl-11 rounded-xl border-2 border-[#F0C05A]"
              />
            </div>
          </div>
        </div>

        {/* Redes sociais */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Redes sociais</h3>
          <Input
            placeholder="Instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="rounded-xl border-2 border-[#F0C05A]"
          />
          <Input
            placeholder="Facebook"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className="rounded-xl border-2 border-[#F0C05A]"
          />
          <Input
            placeholder="Twitter"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="rounded-xl border-2 border-[#F0C05A]"
          />
        </div>

        {/* Privacidade */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Privacidade</h3>
          <label className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 cursor-pointer">
            <span className="text-sm font-medium">Perfil privado</span>
            <input
              type="checkbox"
              checked={perfilPrivado}
              onChange={(e) => setPerfilPrivado(e.target.checked)}
              className="rounded border-border"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 cursor-pointer">
            <span className="text-sm font-medium">Mostrar localização</span>
            <input
              type="checkbox"
              checked={mostrarLocalizacao}
              onChange={(e) => setMostrarLocalizacao(e.target.checked)}
              className="rounded border-border"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges}
          className="w-full rounded-full gradient-peach px-6 py-4 text-sm font-medium text-primary hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          Salvar Alterações
        </button>
      </div>

      {saved && (
        <div className="fixed bottom-24 left-4 right-4 bg-primary text-primary-foreground text-sm text-center py-3 rounded-xl z-50">
          Alterações salvas!
        </div>
      )}

      <BottomNav />
    </main>
  );
}
