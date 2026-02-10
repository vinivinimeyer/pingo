'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabase';

/**
 * ID do usuário "logado" (temporário até ter Supabase Auth)
 *
 * Para trocar o usuário:
 * 1. Acesse Supabase Dashboard → Table Editor → usuarios
 * 2. Copie o ID do usuário que quer usar
 * 3. Cole aqui no CURRENT_USER_ID
 *
 * TODO: Substituir por auth.user.id quando implementar Supabase Auth
 */
export const CURRENT_USER_ID = 'b31bda3b-ffc9-4354-815e-9b0bdd4d4a38';

/**
 * Busca dados do usuário atual
 */
export async function getCurrentUser() {
  const id = (CURRENT_USER_ID || '').trim();
  if (!id || id === 'COLE_UUID_AQUI') {
    console.error('❌ CURRENT_USER_ID não configurado em lib/current-user.ts');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    return null;
  }
}

/**
 * Hook para usar o usuário atual em componentes
 */
export function useCurrentUser() {
  const [usuario, setUsuario] = useState<Awaited<ReturnType<typeof getCurrentUser>>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsuario() {
    try {
      const data = await getCurrentUser();
      if (!data) {
        setError('Usuário não encontrado');
        setUsuario(null);
      } else {
        setUsuario(data);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuário');
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsuario();
  }, []);

  function refetch() {
    setLoading(true);
    fetchUsuario();
  }

  return { usuario, loading, error, refetch };
}
