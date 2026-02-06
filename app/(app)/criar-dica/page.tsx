'use client';

import { Suspense, useState } from 'react';
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
  const [images, setImages] = useState<string[]>([]);
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

  const hasChanges = images.length > 0 || formData.title || formData.description || formData.location || formData.category;

  const handleImageAdd = () => {
    if (images.length >= 10) return;
    // Simular upload - em produção, usar input file real
    const newImage = `/images/upload-${images.length + 1}.jpg`;
    setImages([...images, newImage]);
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (images.length === 0) {
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

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (returnTo === 'catalogo') {
        const novaDica = {
          id: `nova-${Date.now()}`,
          titulo: formData.title,
          localizacao: formData.location,
          image: images[0] || '/images/cafe1.jpg',
          categoria: formData.category,
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem(DICA_NOVA_CRIADA_KEY, JSON.stringify(novaDica));
        }
        router.push('/criar-guia/catalogo');
      } else {
        router.push('/perfil?success=Dica publicada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao publicar:', error);
    } finally {
      setIsLoading(false);
    }
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
    <main className="min-h-screen bg-background pb-20">
      {/* Header fixo */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-primary">Nova dica</h1>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !hasChanges}
            className="text-sm font-semibold text-accent disabled:text-muted-foreground disabled:opacity-50 transition-colors"
          >
            Publicar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Upload de imagens */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Imagens</label>
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                <div className="w-full h-full gradient-peach flex items-center justify-center">
                  <Camera className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded-full font-medium">
                    Capa
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                  aria-label="Remover imagem"
                >
                  <X className="h-3 w-3" strokeWidth={2} />
                </button>
              </div>
            ))}
            {images.length < 10 && (
              <button
                type="button"
                onClick={handleImageAdd}
                className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
              >
                <Camera className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-xs text-muted-foreground text-center px-2">Adicionar foto</span>
              </button>
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

        {/* Botões finais */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              // Salvar rascunho no localStorage
              localStorage.setItem('dica-rascunho', JSON.stringify({ images, ...formData }));
              router.push('/perfil');
            }}
            disabled={isLoading}
          >
            Salvar rascunho
          </Button>
          <Button
            type="submit"
            variant="gradient"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Publicar
          </Button>
        </div>
      </form>

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
