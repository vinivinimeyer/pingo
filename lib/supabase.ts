import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para TypeScript (espelho do schema Supabase)
export type Usuario = {
  id: string;
  nome: string;
  username: string;
  email: string;
  avatar?: string;
  capa?: string;
  bio?: string;
  localizacao?: string;
  website?: string;
  perfil_privado: boolean;
  created_at: string;
  updated_at: string;
};

export type Dica = {
  id: string;
  titulo: string;
  descricao: string;
  imagens: string[];
  categoria: string;
  localizacao: string;
  endereco?: string;
  horario?: string;
  preco_medio?: string;
  telefone?: string;
  website?: string;
  acessibilidade?: string[];
  tags?: string[];
  autor_id: string;
  curtidas: number;
  comentarios: number;
  created_at: string;
  updated_at: string;
};

export type Guia = {
  id: string;
  titulo: string;
  descricao: string;
  capa?: string;
  cidade: string;
  categoria: string;
  autor_id: string;
  curtidas: number;
  saves: number;
  shares: number;
  created_at: string;
  updated_at: string;
};

export type GuiaDica = {
  id: string;
  guia_id: string;
  dica_id: string;
  ordem: number;
  created_at: string;
};

export type Curtida = {
  id: string;
  usuario_id: string;
  dica_id: string;
  created_at: string;
};

export type Salvo = {
  id: string;
  usuario_id: string;
  dica_id: string;
  created_at: string;
};

export type Seguindo = {
  id: string;
  seguidor_id: string;
  seguido_id: string;
  created_at: string;
};

export type Comentario = {
  id: string;
  dica_id: string;
  autor_id: string;
  texto: string;
  curtidas: number;
  created_at: string;
  updated_at: string;
};

export type RedeSocial = {
  id: string;
  usuario_id: string;
  plataforma: string;
  username: string;
  created_at: string;
};
