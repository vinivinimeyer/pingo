'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Image as ImageIcon, MapPin } from 'lucide-react';
import { BottomNav } from '@/components/app/bottom-nav';
import { Input } from '@/components/ui/input';
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
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cidade, setCidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [capa, setCapa] = useState<string | undefined>();

  useEffect(() => {
    const saved = loadGuiaTemp();
    if (saved.titulo) setTitulo(saved.titulo);
    if (saved.descricao) setDescricao(saved.descricao);
    if (saved.cidade) setCidade(saved.cidade);
    if (saved.categoria) setCategoria(saved.categoria);
    if (saved.capa) setCapa(saved.capa);
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

  const handleCapaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCapa(reader.result as string);
    reader.readAsDataURL(file);
  };

  const isValid =
    titulo.trim().length >= 5 &&
    descricao.trim().length >= 20 &&
    cidade.trim().length > 0 &&
    categoria.length > 0;

  const handleAvançar = () => {
    if (!isValid) return;
    router.push('/criar-guia/catalogo');
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
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleFechar}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Criar Guia</h1>
          <button
            type="button"
            onClick={handleAvançar}
            disabled={!isValid}
            className="text-sm font-medium text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Avançar
          </button>
        </div>
      </header>

      <form
        className="px-4 py-6 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleAvançar();
        }}
      >
        {/* Imagem de capa */}
        <div>
          <div className="aspect-[16/9] rounded-2xl border-2 border-dashed border-border bg-muted/30 overflow-hidden relative">
            {capa ? (
              <>
                <img
                  src={capa}
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
            className="rounded-xl border-2 border-[#F0C05A]"
          />
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
            className="w-full rounded-2xl border-2 border-[#F0C05A] bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-y transition-shadow"
          />
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
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <Input
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: São Paulo, SP"
              className="pl-11 rounded-xl border-2 border-[#F0C05A]"
            />
          </div>
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
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full rounded-full gradient-peach px-6 py-4 text-sm font-medium text-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar Dicas
        </button>
      </form>

      <BottomNav />
    </main>
  );
}
