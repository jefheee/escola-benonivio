-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES & SECURITY HARDENING SCRIPT
-- Project: Portal Educacional EEB Benonívio (Production Environment)
-- Target Database: Supabase PostgreSQL 17
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENABLE & FORCE ROW LEVEL SECURITY (RLS) ON ALL SYSTEM TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.escola_acervo ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_avisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_conteudo_paginas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_turmas_posts ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners to ensure no admin bypass occurs outside defined roles
ALTER TABLE IF EXISTS public.escola_acervo FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_avisos FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_documentos FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_notificacoes FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_conteudo_paginas FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_turmas FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.escola_turmas_posts FORCE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. DROP EXISTING POLICIES (CLEAN SLATE RE-APPLICATION)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'escola_acervo', 'escola_avisos', 'escola_documentos', 
            'escola_notificacoes', 'escola_conteudo_paginas', 
            'escola_turmas', 'escola_turmas_posts'
          )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 3. POLICIES: TABELA ESCOLA_AVISOS
-- ------------------------------------------------------------------------------
-- Público/anônimo só pode ler avisos com status 'ativo' e data de publicação válida
CREATE POLICY "Leitura Publica Avisos Publicados"
ON public.escola_avisos FOR SELECT
TO anon
USING (status = 'ativo' AND (data_publicacao IS NULL OR data_publicacao <= CURRENT_TIMESTAMP));

-- Administradores autenticados têm leitura total (inclusive rascunhos e lixeira)
CREATE POLICY "Admin Leitura Avisos"
ON public.escola_avisos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin Insercao Avisos"
ON public.escola_avisos FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Atualizacao Avisos"
ON public.escola_avisos FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Remocao Avisos"
ON public.escola_avisos FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 4. POLICIES: TABELA ESCOLA_ACERVO
-- ------------------------------------------------------------------------------
CREATE POLICY "Leitura Publica Acervo Ativo"
ON public.escola_acervo FOR SELECT
TO anon
USING (status = 'ativo' AND (data_publicacao IS NULL OR data_publicacao <= CURRENT_TIMESTAMP));

CREATE POLICY "Admin Leitura Acervo"
ON public.escola_acervo FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin Insercao Acervo"
ON public.escola_acervo FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Atualizacao Acervo"
ON public.escola_acervo FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Remocao Acervo"
ON public.escola_acervo FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 5. POLICIES: TABELA ESCOLA_NOTIFICACOES
-- ------------------------------------------------------------------------------
CREATE POLICY "Leitura Publica Notificacoes Ativas"
ON public.escola_notificacoes FOR SELECT
TO anon
USING (ativa = true);

CREATE POLICY "Admin Leitura Notificacoes"
ON public.escola_notificacoes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin Insercao Notificacoes"
ON public.escola_notificacoes FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Atualizacao Notificacoes"
ON public.escola_notificacoes FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Remocao Notificacoes"
ON public.escola_notificacoes FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 6. POLICIES: TABELA ESCOLA_TURMAS_POSTS
-- ------------------------------------------------------------------------------
CREATE POLICY "Leitura Publica Turmas Posts Ativos"
ON public.escola_turmas_posts FOR SELECT
TO anon
USING (status = 'ativo' AND (data_publicacao IS NULL OR data_publicacao <= CURRENT_TIMESTAMP));

CREATE POLICY "Admin Leitura Turmas Posts"
ON public.escola_turmas_posts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin Insercao Turmas Posts"
ON public.escola_turmas_posts FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Atualizacao Turmas Posts"
ON public.escola_turmas_posts FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Remocao Turmas Posts"
ON public.escola_turmas_posts FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 7. POLICIES: TABELA ESCOLA_TURMAS
-- ------------------------------------------------------------------------------
CREATE POLICY "Leitura Publica Turmas"
ON public.escola_turmas FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin Insercao Turmas"
ON public.escola_turmas FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Atualizacao Turmas"
ON public.escola_turmas FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Remocao Turmas"
ON public.escola_turmas FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 8. POLICIES: TABELA ESCOLA_DOCUMENTOS
-- ------------------------------------------------------------------------------
CREATE POLICY "Leitura Publica Documentos"
ON public.escola_documentos FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin Insercao Documentos"
ON public.escola_documentos FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Atualizacao Documentos"
ON public.escola_documentos FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Remocao Documentos"
ON public.escola_documentos FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 9. POLICIES: TABELA ESCOLA_CONTEUDO_PAGINAS
-- ------------------------------------------------------------------------------
CREATE POLICY "Leitura Publica Conteudo Paginas"
ON public.escola_conteudo_paginas FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin Insercao Conteudo Paginas"
ON public.escola_conteudo_paginas FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Atualizacao Conteudo Paginas"
ON public.escola_conteudo_paginas FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Admin Remocao Conteudo Paginas"
ON public.escola_conteudo_paginas FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 10. STORAGE BUCKET SECURITY POLICIES (escola_midias)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Leitura Publica Midias" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Leitura Pública Mídias" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Upload Midias Autenticado" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Upload Autenticado Mídias" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Update Midias Autenticado" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Update Autenticado Mídias" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Delete Midias Autenticado" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Delete Autenticado Mídias" ON storage.objects';
END $$;

CREATE POLICY "Leitura Publica Midias"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'escola_midias');

CREATE POLICY "Upload Midias Autenticado"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'escola_midias' AND (select auth.uid()) IS NOT NULL);

CREATE POLICY "Update Midias Autenticado"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'escola_midias' AND (select auth.uid()) IS NOT NULL)
WITH CHECK (bucket_id = 'escola_midias' AND (select auth.uid()) IS NOT NULL);

CREATE POLICY "Delete Midias Autenticado"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'escola_midias' AND (select auth.uid()) IS NOT NULL);
