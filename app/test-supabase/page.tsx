'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabasePage() {
  const [usuarios, setUsuarios] = useState<unknown[]>([]);
  const [dicas, setDicas] = useState<unknown[]>([]);
  const [guias, setGuias] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas. Crie .env.local.');
        setLoading(false);
        return;
      }
      try {
        const { data: usuariosData, error: usuariosError } = await supabase
          .from('usuarios')
          .select('*')
          .limit(5);

        if (usuariosError) throw usuariosError;

        const { data: dicasData, error: dicasError } = await supabase
          .from('dicas')
          .select('*')
          .limit(5);

        if (dicasError) throw dicasError;

        const { data: guiasData, error: guiasError } = await supabase
          .from('guias')
          .select('*')
          .limit(5);

        if (guiasError) throw guiasError;

        setUsuarios(usuariosData || []);
        setDicas(dicasData || []);
        setGuias(guiasData || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">Teste Supabase</h1>
        <div className="rounded-xl bg-destructive/10 border border-destructive p-4 text-destructive">
          <p className="font-medium">Erro:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Verifique se o projeto Supabase existe, o schema foi executado e o .env.local está preenchido.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Teste Supabase</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Conexão OK. Dados carregados do banco.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Usuários ({usuarios.length})
          </h2>
          <pre className="bg-muted p-4 rounded-xl overflow-auto text-sm max-h-64">
            {JSON.stringify(usuarios, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Dicas ({dicas.length})
          </h2>
          <pre className="bg-muted p-4 rounded-xl overflow-auto text-sm max-h-64">
            {JSON.stringify(dicas, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Guias ({guias.length})
          </h2>
          <pre className="bg-muted p-4 rounded-xl overflow-auto text-sm max-h-64">
            {JSON.stringify(guias, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}
