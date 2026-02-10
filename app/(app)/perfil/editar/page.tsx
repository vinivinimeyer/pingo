'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Camera } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Input } from '@/components/ui/input';
import { useUpload } from '@/lib/hooks/use-supabase';
import { useCurrentUser } from '@/lib/current-user';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function EditarPerfilPage() {
  const router = useRouter();
  const { uploading, uploadImage } = useUpload();
  const { usuario, loading, error } = useCurrentUser();
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [website, setWebsite] = useState('');

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome ?? '');
      setUsername(usuario.username ?? '');
      setBio(usuario.bio ?? '');
      setLocalizacao(usuario.localizacao ?? '');
      setWebsite(usuario.website ?? '');
      setAvatarPreview(usuario.avatar ?? null);
      setCapaPreview(usuario.capa ?? null);
    }
  }, [usuario]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleCapaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCapaFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario) return;

    setSalvando(true);

    try {
      let avatarUrl = usuario.avatar;
      let capaUrl = usuario.capa;

      if (avatarFile) {
        const { url, error } = await uploadImage(avatarFile, 'avatars');
        if (error) throw new Error(error);
        avatarUrl = url ?? undefined;
      }

      if (capaFile) {
        const { url, error } = await uploadImage(capaFile, 'avatars');
        if (error) throw new Error(error);
        capaUrl = url ?? undefined;
      }

      const { error } = await supabase
        .from('usuarios')
        .update({
          nome,
          username,
          bio: bio || null,
          localizacao: localizacao || null,
          website: website || null,
          avatar: avatarUrl,
          capa: capaUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', usuario.id);

      if (error) throw error;

      router.push('/perfil?success=Perfil atualizado!');
    } catch (err) {
      alert('Erro ao salvar: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </main>
    );
  }

  if (!usuario && !loading) {
    return (
      <main className="min-h-screen bg-background pb-24 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {error || 'Usuário não encontrado'}
          </p>
          <p className="text-xs text-muted-foreground">
            Configure CURRENT_USER_ID em lib/current-user.ts
          </p>
        </div>
      </main>
    );
  }

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
            onClick={handleSalvar}
            disabled={salvando || uploading}
            className="text-sm font-medium text-accent disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </header>

      <form onSubmit={handleSalvar} className="px-4 py-6 space-y-6">
        <div>
          <div
            className="relative aspect-[3/1] rounded-2xl overflow-hidden bg-muted cursor-pointer"
            onClick={() => (document.getElementById('capa-input') as HTMLInputElement)?.click()}
          >
            {(capaPreview ?? usuario.capa) ? (
              <img
                src={capaPreview ?? usuario.capa}
                alt="Capa"
                className="w-full h-full object-cover"
              />
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
              id="capa-input"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleCapaChange}
            />
          </div>
          <div className="flex justify-center -mt-12 relative z-10">
            <button
              type="button"
              onClick={() => (document.getElementById('avatar-input') as HTMLInputElement)?.click()}
              className="relative h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-muted"
            >
              <Image
                src={avatarPreview ?? usuario.avatar ?? '/images/hero1.jpg'}
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
              id="avatar-input"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome completo
            </label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={cn('rounded-xl border-2', 'border-[#F0C05A]')}
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Site
            </label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="rounded-xl border-2 border-[#F0C05A]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={salvando || uploading}
          className="w-full rounded-full gradient-peach px-6 py-4 text-sm font-medium text-primary hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {salvando || uploading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>

      <BottomNav />
    </main>
  );
}
