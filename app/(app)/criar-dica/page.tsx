'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Camera, MapPin } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useUpload } from '@/lib/hooks/use-supabase';
import { getCurrentUser } from '@/lib/current-user';
import { supabase } from '@/lib/supabase';

const categories = [
  'Restaurantes',
  'Hotéis',
  'Museus',
  'Praias',
  'Natureza',
  'Compras',
];

const DICA_NOVA_CRIADA_KEY = 'dica-nova-criada';

function CriarDicaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const action = searchParams?.get('action');
  const { uploading, progress, uploadMultiple } = useUpload();
  const [imagens, setImagens] = useState<File[]>([]);
  const [imagensPreviews, setImagensPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
  });
  const [errors, setErrors] = useState<{
    images?: string;
    title?: string;
    description?: string;
    location?: string;
    category?: string;
  }>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [salvandoRascunho, setSalvandoRascunho] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dicaPublicada, setDicaPublicada] = useState<{ id: string } | null>(null);

  const hasChanges =
    imagens.length > 0 ||
    formData.title ||
    formData.description ||
    formData.location ||
    formData.category;

  const titulo = formData.title.trim();
  const descricao = formData.description.trim();
  const categoria = formData.category;
  const localizacao = formData.location.trim();
  const podeContinuar =
    titulo.length >= 5 &&
    descricao.length >= 20 &&
    !!categoria &&
    !!localizacao &&
    imagens.length > 0;
  const podeRascunho = titulo.length > 0 && descricao.length > 0;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (imagens.length + files.length > 10) return;
    setImagens((prev) => [...prev, ...files].slice(0, 10));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagensPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function removerImagem(index: number) {
    setImagens((prev) => prev.filter((_, i) => i !== index));
    setImagensPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  const publishTriggered = useRef(false);
  useEffect(() => {
    if (action === 'publish' && !publishTriggered.current) {
      publishTriggered.current = true;
      handlePublicar();
    }
  }, [action]);

  async function handlePublicar() {
    setIsLoading(true);
    try {
      let urls: string[];
      let insertTitulo = titulo;
      let insertDescricao = descricao;
      let insertCategoria = categoria || 'Outros';
      let insertLocalizacao = localizacao || 'Não informado';

      const pendingRaw = typeof window !== 'undefined' ? localStorage.getItem('dica-publish-pending') : null;
      if (pendingRaw) {
        const parsed = JSON.parse(pendingRaw) as { titulo?: string; descricao?: string; categoria?: string; localizacao?: string; imagensBase64?: string[] };
        insertTitulo = parsed.titulo || titulo;
        insertDescricao = parsed.descricao || descricao;
        insertCategoria = parsed.categoria || 'Outros';
        insertLocalizacao = parsed.localizacao || 'Não informado';
        const files: File[] = await Promise.all(
          (parsed.imagensBase64 || []).map(async (dataUrl: string, i: number) => {
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            return new File([blob], `img-${i}.jpg`, { type: blob.type || 'image/jpeg' });
          })
        );
        const result = await uploadMultiple(files, 'dicas');
        if (result.error) throw new Error(result.error);
        urls = result.urls;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dica-publish-pending');
          localStorage.removeItem('dica-temp');
        }
      } else {
        const result = await uploadMultiple(imagens, 'dicas');
        if (result.error) throw new Error(result.error);
        urls = result.urls;
      }

      const usuario = await getCurrentUser();
      if (!usuario) throw new Error('Usuário não encontrado');

      const { data, error } = await supabase
        .from('dicas')
        .insert({
          titulo: insertTitulo || formData.title.trim(),
          descricao: insertDescricao || formData.description.trim(),
          imagens: urls,
          categoria: insertCategoria,
          localizacao: insertLocalizacao,
          autor_id: usuario.id,
          status: 'publicado',
          curtidas: 0,
          comentarios: 0,
        })
        .select()
        .single();

      if (error) throw error;

      if (returnTo === 'catalogo') {
        if (typeof window !== 'undefined') {
          localStorage.setItem(DICA_NOVA_CRIADA_KEY, JSON.stringify(data));
        }
        router.push('/criar-guia/catalogo');
        return;
      }

      if (typeof window !== 'undefined') localStorage.removeItem('dica-temp');
      setDicaPublicada(data);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      alert('Erro ao publicar: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSalvarRascunho() {
    if (!titulo || !descricao) return;
    setSalvandoRascunho(true);
    try {
      const { urls, error: uploadError } = await uploadMultiple(imagens, 'dicas');
      if (uploadError) throw new Error(uploadError);

      const usuario = await getCurrentUser();
      if (!usuario) throw new Error('Usuário não encontrado');

      const { error } = await supabase.from('dicas').insert({
        titulo: titulo || 'Sem título',
        descricao,
        imagens: urls.length > 0 ? urls : [''],
        categoria: categoria || 'Outros',
        localizacao: localizacao || 'Não informado',
        autor_id: usuario.id,
        status: 'rascunho',
        curtidas: 0,
        comentarios: 0,
      });

      if (error) throw error;
      router.push('/perfil?success=Rascunho salvo!');
    } catch (err: unknown) {
      alert('Erro ao salvar rascunho: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSalvandoRascunho(false);
    }
  }

  function handleContinuar() {
    if (!podeContinuar) return;
    const payload = {
      titulo,
      descricao,
      categoria,
      localizacao,
      imagensPreviews: imagensPreviews,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('dica-temp', JSON.stringify(payload));
      localStorage.setItem('dica-publish-pending', JSON.stringify({
        titulo,
        descricao,
        categoria,
        localizacao,
        imagensBase64: imagensPreviews,
      }));
    }
    router.push('/criar-dica/preview');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (imagens.length === 0) {
      newErrors.images = 'Adicione pelo menos uma imagem';
    }
    if (!formData.title.trim() || formData.title.trim().length < 5) {
      newErrors.title = 'Título deve ter pelo menos 5 caracteres';
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      newErrors.description = 'Descrição deve ter pelo menos 20 caracteres';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Localização é obrigatória';
    }
    if (!formData.category) {
      newErrors.category = 'Selecione uma categoria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    handleContinuar();
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirmDialog(true);
    } else {
      router.back();
    }
  };

  const handleDiscard = () => {
    setShowConfirmDialog(false);
    router.back();
  };

  return (
    <main className="min-h-screen bg-background pb-40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg font-bold text-foreground">Nova dica</h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Conteúdo com scroll */}
      <div className="px-4 py-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Upload de imagens */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Imagens</label>
          <div className="grid grid-cols-3 gap-3">
            {imagensPreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded-full font-medium">
                    Capa
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removerImagem(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                  aria-label="Remover imagem"
                >
                  <X className="h-3 w-3" strokeWidth={2} />
                </button>
              </div>
            ))}
            {imagens.length < 10 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer">
                <Camera className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-xs text-muted-foreground text-center px-2">Adicionar foto</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
          {errors.images && (
            <p className="text-xs text-destructive mt-1">{errors.images}</p>
          )}
        </div>

        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-primary mb-2">
            Título
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Ex: Melhor café da região"
            value={formData.title}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            maxLength={100}
            error={!!errors.title}
          />
          <div className="flex justify-between mt-1">
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
            <p className="text-xs text-muted-foreground ml-auto">
              {formData.title.length}/100
            </p>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-primary mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, description: e.target.value }));
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            placeholder="Conte mais sobre este lugar..."
            className={`w-full rounded-2xl border-2 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow min-h-[120px] resize-none ${
              errors.description ? 'border-destructive focus:ring-destructive' : 'border-[#F0C05A]'
            }`}
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground ml-auto">
              {formData.description.length}/500
            </p>
          </div>
        </div>

        {/* Localização */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-primary mb-2">
            Localização
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <Input
              id="location"
              type="text"
              placeholder="Buscar endereço..."
              value={formData.location}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, location: e.target.value }));
                if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
              }}
              className="pl-11"
              error={!!errors.location}
            />
          </div>
          {errors.location && (
            <p className="text-xs text-destructive mt-1">{errors.location}</p>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Categoria</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, category: cat }));
                  if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                className={`rounded-full border-2 px-4 py-2 text-center text-sm font-medium transition-colors ${
                  formData.category === cat
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-card text-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="text-xs text-destructive mt-1">{errors.category}</p>
          )}
        </div>

      </form>
      </div>

      {/* Botões de ação - fixos acima do BottomNav */}
      <div className="fixed bottom-20 left-0 right-0 z-50 bg-background border-t border-border p-4">
        <div className="flex gap-3 max-w-xl mx-auto">
          <button
            type="button"
            onClick={handleSalvarRascunho}
            disabled={!titulo || !descricao || salvandoRascunho}
            className="flex-1 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
          >
            {salvandoRascunho ? 'Salvando...' : 'Salvar Rascunho'}
          </button>
          <button
            type="button"
            onClick={handleContinuar}
            disabled={!titulo || !descricao || !categoria || !localizacao || imagens.length === 0}
            className="flex-1 rounded-full gradient-peach px-6 py-3 text-sm font-medium text-primary disabled:opacity-50"
          >
            Continuar
          </button>
        </div>
      </div>

      {/* BottomNav - fixo embaixo */}

      {/* Modal de sucesso */}
      {showSuccessModal && dicaPublicada && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
          <div className="mx-4 max-w-sm w-full rounded-3xl bg-card p-8 shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
              <svg
                className="h-12 w-12 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-center text-xl font-bold mb-2">Dica Publicada!</h3>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Sua dica já está disponível no feed
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => router.push(`/dica/${dicaPublicada.id}`)}
                className="w-full rounded-full gradient-peach px-6 py-3 text-sm font-medium text-primary"
              >
                Ver Dica
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setDicaPublicada(null);
                  setFormData({ title: '', description: '', location: '', category: '' });
                  setImagens([]);
                  setImagensPreviews([]);
                }}
                className="w-full rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                Criar Outra Dica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação */}
      <Sheet open={showConfirmDialog} onOpenChange={setShowConfirmDialog} side="bottom">
        <SheetContent onClose={() => setShowConfirmDialog(false)}>
          <SheetHeader>
            <SheetTitle>Descartar dica?</SheetTitle>
            <SheetDescription>Suas alterações serão perdidas.</SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 space-y-3">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDiscard}
            >
              Descartar
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancelar
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-card p-6 shadow-2xl max-w-sm w-full mx-4">
            <p className="text-sm font-medium mb-4">Enviando imagens...</p>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

export default function CriarDicaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Carregando...</div>}>
      <CriarDicaPageContent />
    </Suspense>
  );
}
