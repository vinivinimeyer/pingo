-- ============================================
-- SCHEMA DO PINGO - Sprint 5
-- Executar no Supabase: SQL Editor → New Query → Colar e Run
-- ============================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  capa TEXT,
  bio TEXT,
  localizacao TEXT,
  website TEXT,
  perfil_privado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Dicas
CREATE TABLE IF NOT EXISTS dicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  imagens TEXT[] NOT NULL,
  categoria TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  endereco TEXT,
  horario TEXT,
  preco_medio TEXT,
  telefone TEXT,
  website TEXT,
  acessibilidade TEXT[],
  tags TEXT[],
  autor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  curtidas INTEGER DEFAULT 0,
  comentarios INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Guias
CREATE TABLE IF NOT EXISTS guias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  capa TEXT,
  cidade TEXT NOT NULL,
  categoria TEXT NOT NULL,
  autor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  curtidas INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relação Guias <-> Dicas
CREATE TABLE IF NOT EXISTS guias_dicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guia_id UUID REFERENCES guias(id) ON DELETE CASCADE,
  dica_id UUID REFERENCES dicas(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guia_id, dica_id)
);

-- Tabela de Curtidas
CREATE TABLE IF NOT EXISTS curtidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  dica_id UUID REFERENCES dicas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, dica_id)
);

-- Tabela de Salvos
CREATE TABLE IF NOT EXISTS salvos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  dica_id UUID REFERENCES dicas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, dica_id)
);

-- Tabela de Seguindo
CREATE TABLE IF NOT EXISTS seguindo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seguidor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  seguido_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seguidor_id, seguido_id),
  CHECK (seguidor_id != seguido_id)
);

-- Tabela de Comentários
CREATE TABLE IF NOT EXISTS comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dica_id UUID REFERENCES dicas(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  curtidas INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Redes Sociais
CREATE TABLE IF NOT EXISTS redes_sociais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  plataforma TEXT NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, plataforma)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_dicas_autor ON dicas(autor_id);
CREATE INDEX IF NOT EXISTS idx_dicas_categoria ON dicas(categoria);
CREATE INDEX IF NOT EXISTS idx_dicas_created ON dicas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guias_autor ON guias(autor_id);
CREATE INDEX IF NOT EXISTS idx_guias_categoria ON guias(categoria);
CREATE INDEX IF NOT EXISTS idx_guias_created ON guias(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guias_dicas_guia ON guias_dicas(guia_id);
CREATE INDEX IF NOT EXISTS idx_guias_dicas_dica ON guias_dicas(dica_id);
CREATE INDEX IF NOT EXISTS idx_curtidas_usuario ON curtidas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_curtidas_dica ON curtidas(dica_id);
CREATE INDEX IF NOT EXISTS idx_seguindo_seguidor ON seguindo(seguidor_id);
CREATE INDEX IF NOT EXISTS idx_seguindo_seguido ON seguindo(seguido_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_dica ON comentarios(dica_id);

-- RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE dicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE guias ENABLE ROW LEVEL SECURITY;
ALTER TABLE guias_dicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE curtidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE salvos ENABLE ROW LEVEL SECURITY;
ALTER TABLE seguindo ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE redes_sociais ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de leitura
CREATE POLICY "Usuarios publicos" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Atualizar usuarios" ON usuarios FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Dicas publicas" ON dicas FOR SELECT USING (true);
CREATE POLICY "Guias publicos" ON guias FOR SELECT USING (true);
CREATE POLICY "Guias-dicas publicos" ON guias_dicas FOR SELECT USING (true);
CREATE POLICY "Curtidas publicas" ON curtidas FOR SELECT USING (true);
CREATE POLICY "Salvos publicos" ON salvos FOR SELECT USING (true);
CREATE POLICY "Seguindo publicos" ON seguindo FOR SELECT USING (true);
CREATE POLICY "Comentarios publicos" ON comentarios FOR SELECT USING (true);

-- Políticas de escrita (tempo de desenvolvimento)
CREATE POLICY "Inserir dicas" ON dicas FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualizar dicas" ON dicas FOR UPDATE USING (true);
CREATE POLICY "Deletar dicas" ON dicas FOR DELETE USING (true);
CREATE POLICY "Inserir guias" ON guias FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualizar guias" ON guias FOR UPDATE USING (true);
CREATE POLICY "Deletar guias" ON guias FOR DELETE USING (true);
CREATE POLICY "Inserir guias_dicas" ON guias_dicas FOR INSERT WITH CHECK (true);
CREATE POLICY "Deletar guias_dicas" ON guias_dicas FOR DELETE USING (true);
CREATE POLICY "Inserir curtidas" ON curtidas FOR INSERT WITH CHECK (true);
CREATE POLICY "Deletar curtidas" ON curtidas FOR DELETE USING (true);
CREATE POLICY "Inserir salvos" ON salvos FOR INSERT WITH CHECK (true);
CREATE POLICY "Deletar salvos" ON salvos FOR DELETE USING (true);
CREATE POLICY "Inserir seguindo" ON seguindo FOR INSERT WITH CHECK (true);
CREATE POLICY "Deletar seguindo" ON seguindo FOR DELETE USING (true);
CREATE POLICY "Inserir comentarios" ON comentarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualizar comentarios" ON comentarios FOR UPDATE USING (true);
CREATE POLICY "Deletar comentarios" ON comentarios FOR DELETE USING (true);
