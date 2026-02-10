'use client';

import { useState, useEffect } from 'react';
import { supabase, type Dica, type Guia, type Usuario } from '@/lib/supabase';

export type DicaComAutor = Dica & { autor?: Usuario | Usuario[] };
export type GuiaComAutor = Guia & { autor?: Usuario | Usuario[] };

export function useDicas() {
  const [dicas, setDicas] = useState<DicaComAutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDicas() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('dicas')
        .select('*, autor:usuarios(*)')
        .order('created_at', { ascending: false });

      if (err) throw err;
      const list = (data || []) as (Dica & { autor?: Usuario | Usuario[]; usuarios?: Usuario | Usuario[] })[];
      setDicas(
        list.map((d) => {
          const autor = d.autor ?? (d as { usuarios?: Usuario | Usuario[] }).usuarios;
          const a = Array.isArray(autor) ? autor[0] : autor;
          return { ...d, autor: a } as DicaComAutor;
        })
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDicas();
  }, []);

  async function criarDica(dica: Partial<Dica>) {
    try {
      const { data, error: err } = await supabase
        .from('dicas')
        .insert(dica)
        .select('*, autor:usuarios(*)')
        .single();

      if (err) throw err;
      const item = data as DicaComAutor;
      const autor = Array.isArray(item.autor) ? item.autor[0] : item.autor;
      setDicas((prev) => [{ ...item, autor }, ...prev]);
      return { data: item, error: null };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err.message : String(err) };
    }
  }

  async function deletarDica(id: string) {
    try {
      const { error: err } = await supabase.from('dicas').delete().eq('id', id);
      if (err) throw err;
      setDicas((prev) => prev.filter((d) => d.id !== id));
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }

  return { dicas, loading, error, fetchDicas, criarDica, deletarDica };
}

export function useGuias() {
  const [guias, setGuias] = useState<GuiaComAutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchGuias() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('guias')
        .select('*, autor:usuarios(*)')
        .order('created_at', { ascending: false });

      if (err) throw err;
      const list = (data || []) as (Guia & { autor?: Usuario | Usuario[]; usuarios?: Usuario | Usuario[] })[];
      setGuias(
        list.map((g) => {
          const autor = g.autor ?? (g as { usuarios?: Usuario | Usuario[] }).usuarios;
          const a = Array.isArray(autor) ? autor[0] : autor;
          return { ...g, autor: a } as GuiaComAutor;
        })
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGuias();
  }, []);

  async function criarGuia(guia: Partial<Guia>) {
    try {
      const { data, error: err } = await supabase
        .from('guias')
        .insert(guia)
        .select('*, autor:usuarios(*)')
        .single();

      if (err) throw err;
      const item = data as GuiaComAutor;
      const autor = Array.isArray(item.autor) ? item.autor[0] : item.autor;
      setGuias((prev) => [{ ...item, autor }, ...prev]);
      return { data: item, error: null };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err.message : String(err) };
    }
  }

  return { guias, loading, error, fetchGuias, criarGuia };
}

export function useCurtidas(dicaId: string | null, usuarioId: string | null) {
  const [curtido, setCurtido] = useState(false);
  const [curtidas, setCurtidas] = useState(0);

  async function checkCurtida() {
    if (!dicaId || !usuarioId) return;
    const { data } = await supabase
      .from('curtidas')
      .select('id')
      .eq('dica_id', dicaId)
      .eq('usuario_id', usuarioId)
      .maybeSingle();
    setCurtido(!!data);
  }

  async function fetchCurtidas() {
    if (!dicaId) return;
    const { count } = await supabase
      .from('curtidas')
      .select('*', { count: 'exact', head: true })
      .eq('dica_id', dicaId);
    setCurtidas(count ?? 0);
  }

  useEffect(() => {
    checkCurtida();
    fetchCurtidas();
  }, [dicaId, usuarioId]);

  async function toggleCurtida() {
    if (!dicaId || !usuarioId) return;
    if (curtido) {
      await supabase
        .from('curtidas')
        .delete()
        .eq('dica_id', dicaId)
        .eq('usuario_id', usuarioId);
      setCurtido(false);
      setCurtidas((prev) => Math.max(0, prev - 1));
    } else {
      await supabase.from('curtidas').insert({ dica_id: dicaId, usuario_id: usuarioId });
      setCurtido(true);
      setCurtidas((prev) => prev + 1);
    }
  }

  return { curtido, curtidas, toggleCurtida };
}

export function useSalvos(dicaId: string | null, usuarioId: string | null) {
  const [salvo, setSalvo] = useState(false);

  async function checkSalvo() {
    if (!dicaId || !usuarioId) return;
    const { data } = await supabase
      .from('salvos')
      .select('id')
      .eq('dica_id', dicaId)
      .eq('usuario_id', usuarioId)
      .maybeSingle();
    setSalvo(!!data);
  }

  useEffect(() => {
    checkSalvo();
  }, [dicaId, usuarioId]);

  async function toggleSalvo() {
    if (!dicaId || !usuarioId) return;
    if (salvo) {
      await supabase
        .from('salvos')
        .delete()
        .eq('dica_id', dicaId)
        .eq('usuario_id', usuarioId);
      setSalvo(false);
    } else {
      await supabase.from('salvos').insert({ dica_id: dicaId, usuario_id: usuarioId });
      setSalvo(true);
    }
  }

  return { salvo, toggleSalvo };
}

export function useSeguindo(seguidoId: string | null, seguidorId: string | null) {
  const [seguindo, setSeguindo] = useState(false);

  async function checkSeguindo() {
    if (!seguidoId || !seguidorId || seguidoId === seguidorId) return;
    const { data } = await supabase
      .from('seguindo')
      .select('id')
      .eq('seguido_id', seguidoId)
      .eq('seguidor_id', seguidorId)
      .maybeSingle();
    setSeguindo(!!data);
  }

  useEffect(() => {
    checkSeguindo();
  }, [seguidoId, seguidorId]);

  async function toggleSeguindo() {
    if (!seguidoId || !seguidorId || seguidoId === seguidorId) return;
    if (seguindo) {
      await supabase
        .from('seguindo')
        .delete()
        .eq('seguido_id', seguidoId)
        .eq('seguidor_id', seguidorId);
      setSeguindo(false);
    } else {
      await supabase.from('seguindo').insert({ seguido_id: seguidoId, seguidor_id: seguidorId });
      setSeguindo(true);
    }
  }

  return { seguindo, toggleSeguindo };
}

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function doUploadOne(
    file: File,
    bucket: 'avatars' | 'dicas' | 'guias'
  ): Promise<{ url: string | null; error: string | null }> {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) return { url: null, error: error.message };

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return { url: publicUrl, error: null };
  }

  async function uploadImage(
    file: File,
    bucket: 'avatars' | 'dicas' | 'guias'
  ): Promise<{ url: string | null; error: string | null }> {
    setUploading(true);
    setProgress(0);
    try {
      const result = await doUploadOne(file, bucket);
      setProgress(100);
      return result;
    } finally {
      setUploading(false);
    }
  }

  async function uploadMultiple(
    files: File[],
    bucket: 'avatars' | 'dicas' | 'guias'
  ): Promise<{ urls: string[]; error: string | null }> {
    setUploading(true);
    const urls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(((i + 1) / files.length) * 100);
        const { url, error } = await doUploadOne(files[i], bucket);
        if (error) return { urls, error };
        if (url) urls.push(url);
      }
      return { urls, error: null };
    } finally {
      setUploading(false);
    }
  }

  return { uploading, progress, uploadImage, uploadMultiple };
}
