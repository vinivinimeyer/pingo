-- ============================================
-- SPRINT 8: Campo status (rascunho / publicado)
-- Executar no Supabase → SQL Editor → New Query → Colar e Run
-- ============================================

-- Adicionar campo status em dicas
ALTER TABLE dicas
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'publicado';

-- Adicionar campo status em guias
ALTER TABLE guias
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'publicado';

-- Atualizar dicas existentes
UPDATE dicas SET status = 'publicado' WHERE status IS NULL;

-- Atualizar guias existentes
UPDATE guias SET status = 'publicado' WHERE status IS NULL;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_dicas_status ON dicas(status);
CREATE INDEX IF NOT EXISTS idx_guias_status ON guias(status);
