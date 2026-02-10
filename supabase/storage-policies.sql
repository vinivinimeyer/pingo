-- ============================================
-- STORAGE: Buckets e políticas para upload de imagens
-- Executar no Supabase: SQL Editor → New Query → Colar e Run
-- ============================================
-- Se os buckets já existirem (criados pelo Dashboard), pule o bloco INSERT abaixo
-- e execute apenas as políticas (CREATE POLICY).

-- 1. Criar buckets (execute se ainda não criou pelo Dashboard)
-- Se der erro de coluna, crie os buckets manualmente: Storage → New bucket (avatars, dicas, guias) e marque Public.
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('dicas', 'dicas', true),
  ('guias', 'guias', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Políticas para o bucket avatars (upload e leitura pública)
DROP POLICY IF EXISTS "Avatar upload anon" ON storage.objects;
CREATE POLICY "Avatar upload anon"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatar read public" ON storage.objects;
CREATE POLICY "Avatar read public"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 3. Políticas para o bucket dicas
DROP POLICY IF EXISTS "Dicas upload anon" ON storage.objects;
CREATE POLICY "Dicas upload anon"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'dicas');

DROP POLICY IF EXISTS "Dicas read public" ON storage.objects;
CREATE POLICY "Dicas read public"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dicas');

-- 4. Políticas para o bucket guias
DROP POLICY IF EXISTS "Guias upload anon" ON storage.objects;
CREATE POLICY "Guias upload anon"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'guias');

DROP POLICY IF EXISTS "Guias read public" ON storage.objects;
CREATE POLICY "Guias read public"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'guias');
