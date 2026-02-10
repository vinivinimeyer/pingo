'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Image as ImageIcon, MapPin } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Input } from '@/components/ui/input';
import { useUpload } from '@/lib/hooks/use-supabase';
import { getCurrentUser } from '@/lib/current-user';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const GUIA_TEMP_KEY = 'guia-temp';

export interface GuiaTemp {
  titulo: string;
  descricao: string;
  cidade: string;
  categoria: string;
  capa?: string;
}

const CATEGORIAS = [
  'Roteiro',
  'Restaurantes',
  'Vida Noturna',
  'Cultura',
  'Natureza',
  'Compras',
];

function loadGuiaTemp(): Partial<GuiaTemp> {
  if (typeof window === 'undefined') return {};
  try {
    const s = localStorage.getItem(GUIA_TEMP_KEY);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

function saveGuiaTemp(data: Partial<GuiaTemp>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUIA_TEMP_KEY, JSON.stringify(data));
}

export default function CriarGuiaPage() {
  const router = useRouter();
  const { uploading, uploadImage } = useUpload();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cidade, setCidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);
  const [capa, setCapa] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [salvandoRascunho, setSalvandoRascunho] = useState(false);

  useEffect(() => {
    const saved = loadGuiaTemp();
    if (saved.titulo) setTitulo(saved.titulo);
    if (saved.descricao) setDescricao(saved.descricao);
    if (saved.cidade) setCidade(saved.cidade);
    if (saved.categoria) setCategoria(saved.categoria);
    if (saved.capa) {
      setCapa(saved.capa);
      setCapaPreview(saved.capa);
    }
  }, []);

  useEffect(() => {
    saveGuiaTemp({
      titulo,
      descricao,
      cidade,
      categoria,
      capa,
    });
  }, [titulo, descricao, cidade, categoria, capa]);

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

  const tituloValido = titulo.trim().length >= 5;
  const descricaoValida = descricao.trim().length >= 20;
  const cidadeValida = cidade.trim().length > 0;
  const categoriaValida = categoria.length > 0;
  const isValid = tituloValido && descricaoValida && cidadeValida && categoriaValida;

  const faltando: string[] = [];
  if (!tituloValido) faltando.push(titulo.length > 0 ? 'Título (mín. 5 caracteres)' : 'Título');
  if (!descricaoValida) faltando.push(descricao.length > 0 ? 'Descrição (mín. 20 caracteres)' : 'Descrição');
  if (!cidadeValida) faltando.push('Cidade ou região');
  if (!categoriaValida) faltando.push('Tipo de guia');
  const tooltipDesabilitado = faltando.length > 0 ? `Faltam: ${faltando.join(', ')}` : '';

  const handleSalvarRascunho = async () => {
    if (!titulo.trim() || !descricao.trim()) return;

    setSalvandoRascunho(true);
    try {
      let capaUrl: string | null = null;
      if (capaFile) {
        const { url, error } = await uploadImage(capaFile, 'guias');
        if (error) throw new Error(error);
        capaUrl = url;
      } else if (capa) {
        capaUrl = capa;
      }

      const usuario = await getCurrentUser();
      if (!usuario) throw new Error('Usuário não encontrado');

      const { error } = await supabase.from('guias').insert({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        capa: capaUrl,
        cidade: cidade.trim() || 'Não informado',
        categoria: categoria || 'Outros',
        autor_id: usuario.id,
        status: 'rascunho',
        curtidas: 0,
        saves: 0,
        shares: 0,
      });

      if (error) throw error;
      router.push('/perfil?success=Rascunho de guia salvo!');
    } catch (err: unknown) {
      alert('Erro ao salvar rascunho: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSalvandoRascunho(false);
    }
  };

  const handleAvançar = async () => {
    if (!isValid) return;

    const capaAtual = capa;
    setLoading(true);
    try {
      let capaUrl: string | null = capaAtual ?? null;

      if (capaFile) {
        const { url, error } = await uploadImage(capaFile, 'guias');
        if (error) throw new Error(error);
        capaUrl = url;
        setCapa(capaUrl ?? undefined);
      }

      const guiaTemp = {
        titulo,
        descricao,
        capa: capaUrl ?? undefined,
        cidade,
        categoria,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(GUIA_TEMP_KEY, JSON.stringify(guiaTemp));
      }
      router.push('/criar-guia/catalogo');
    } catch (err: unknown) {
      alert('Erro: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleFechar = () => {
    if (
      titulo || descricao || cidade || categoria || capa
        ? window.confirm('Descartar guia?')
        : true
    ) {
      router.back();
    }
  };

  return (
    <main className="min-h-screen bg-background pb-40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={handleFechar}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg font-bold text-foreground">Novo guia</h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Conteúdo com scroll */}
      <div className="px-4 py-6 space-y-6">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleAvançar();
        }}
      >
        {/* Imagem de capa */}
        <div>
          <div className="aspect-[16/9] rounded-2xl border-2 border-dashed border-border bg-muted/30 overflow-hidden relative">
            {(capaPreview ?? capa) ? (
              <>
                <img
                  src={capaPreview ?? capa}
                  alt="Capa do guia"
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-foreground/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="rounded-full bg-card px-4 py-2 text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" strokeWidth={1.5} />
                    Alterar
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleCapaChange}
                  />
                </label>
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer">
                <ImageIcon className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium text-muted-foreground">
                  Adicionar capa
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleCapaChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Título do Guia
          </label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Roteiro 3 dias em São Paulo"
            maxLength={80}
            error={!tituloValido}
            className="rounded-xl"
          />
          {!tituloValido && (
            <p className="text-xs text-destructive mt-1">
              {titulo.length === 0 ? 'Informe o título do guia (mín. 5 caracteres)' : 'Título precisa de pelo menos 5 caracteres'}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {titulo.length}/80
          </p>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Descrição
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o que este guia oferece..."
            maxLength={300}
            minLength={20}
            className={cn(
              'w-full rounded-2xl border-2 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 min-h-[100px] resize-y transition-shadow',
              !descricaoValida
                ? 'border-destructive focus:ring-destructive'
                : 'border-[#F0C05A] focus:ring-ring'
            )}
          />
          {!descricaoValida && (
            <p className="text-xs text-destructive mt-1">
              {descricao.length === 0 ? 'Informe a descrição (mín. 20 caracteres)' : 'Descrição precisa de pelo menos 20 caracteres'}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {descricao.length}/300
          </p>
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Cidade ou Região
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" strokeWidth={1.5} />
            <Input
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: São Paulo, SP"
              error={!cidadeValida}
              className="pl-11 rounded-xl"
            />
          </div>
          {!cidadeValida && (
            <p className="text-xs text-destructive mt-1">Informe a cidade ou região</p>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Tipo de Guia
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoria(cat)}
                className={cn(
                  'rounded-full border-2 px-4 py-3 text-center text-sm font-medium transition-colors',
                  categoria === cat
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-card text-foreground hover:bg-muted'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          {!categoriaValida && (
            <p className="text-xs text-destructive mt-2">Selecione o tipo de guia</p>
          )}
        </div>

      </form>

      {!isValid && tooltipDesabilitado && (
        <p className="text-xs text-muted-foreground text-center mt-2" role="status">
          {tooltipDesabilitado}
        </p>
      )}
      </div>

      {/* Botões de ação - fixos acima do BottomNav */}
      <div className="fixed bottom-20 left-0 right-0 z-50 bg-background border-t border-border p-4">
        <div className="flex gap-3 max-w-xl mx-auto">
          <button
            type="button"
            onClick={handleSalvarRascunho}
            disabled={!titulo.trim() || !descricao.trim() || salvandoRascunho}
            className="flex-1 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
          >
            {salvandoRascunho ? 'Salvando...' : 'Salvar Rascunho'}
          </button>
          <button
            type="button"
            onClick={handleAvançar}
            disabled={!titulo.trim() || !descricao.trim() || !cidade.trim() || !categoria || loading}
            className="flex-1 rounded-full gradient-peach px-6 py-3 text-sm font-medium text-primary disabled:opacity-50"
          >
            {loading ? '...' : 'Adicionar Dicas'}
          </button>
        </div>
      </div>

      {/* BottomNav - fixo embaixo */}
      <BottomNav />
    </main>
  );
}
