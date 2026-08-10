-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES & SECURITY HARDENING SCRIPT
-- Project: Portal Educacional EEB Benonívio (Production Environment)
-- Target Database: Supabase PostgreSQL
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY (RLS) ON ALL SYSTEM TABLES
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
BEGIN
    -- escola_acervo
    EXECUTE 'DROP POLICY IF EXISTS "Permitir leitura publica em acervo" ON public.escola_acervo';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir insercao apenas para usuarios autenticados" ON public.escola_acervo';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir atualizacao apenas para usuarios autenticados" ON public.escola_acervo';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir remocao apenas para usuarios autenticados" ON public.escola_acervo';

    -- escola_avisos
    EXECUTE 'DROP POLICY IF EXISTS "Permitir leitura publica em avisos" ON public.escola_avisos';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir insercao apenas para usuarios autenticados" ON public.escola_avisos';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir atualizacao apenas para usuarios autenticados" ON public.escola_avisos';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir remocao apenas para usuarios autenticados" ON public.escola_avisos';

    -- escola_documentos
    EXECUTE 'DROP POLICY IF EXISTS "Permitir leitura publica em documentos" ON public.escola_documentos';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir insercao apenas para usuarios autenticados" ON public.escola_documentos';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir atualizacao apenas para usuarios autenticados" ON public.escola_documentos';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir remocao apenas para usuarios autenticados" ON public.escola_documentos';

    -- escola_notificacoes
    EXECUTE 'DROP POLICY IF EXISTS "Permitir leitura publica em notificacoes" ON public.escola_notificacoes';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir insercao apenas para usuarios autenticados" ON public.escola_notificacoes';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir atualizacao apenas para usuarios autenticados" ON public.escola_notificacoes';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir remocao apenas para usuarios autenticados" ON public.escola_notificacoes';

    -- escola_conteudo_paginas
    EXECUTE 'DROP POLICY IF EXISTS "Permitir leitura publica em conteudos de paginas" ON public.escola_conteudo_paginas';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir insercao apenas para usuarios autenticados" ON public.escola_conteudo_paginas';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir atualizacao apenas para usuarios autenticados" ON public.escola_conteudo_paginas';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir remocao apenas para usuarios autenticados" ON public.escola_conteudo_paginas';

    -- escola_turmas
    EXECUTE 'DROP POLICY IF EXISTS "Permitir leitura publica em turmas" ON public.escola_turmas';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir insercao apenas para usuarios autenticados" ON public.escola_turmas';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir atualizacao apenas para usuarios autenticados" ON public.escola_turmas';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir remocao apenas para usuarios autenticados" ON public.escola_turmas';

    -- escola_turmas_posts
    EXECUTE 'DROP POLICY IF EXISTS "Permitir leitura publica em turmas posts" ON public.escola_turmas_posts';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir insercao apenas para usuarios autenticados" ON public.escola_turmas_posts';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir atualizacao apenas para usuarios autenticados" ON public.escola_turmas_posts';
    EXECUTE 'DROP POLICY IF EXISTS "Permitir remocao apenas para usuarios autenticados" ON public.escola_turmas_posts';
END $$;

-- ------------------------------------------------------------------------------
-- 3. POLICIES: TABELA ESCOLA_ACERVO
-- ------------------------------------------------------------------------------
CREATE POLICY "Permitir leitura publica em acervo"
ON public.escola_acervo FOR SELECT
USING (true);

CREATE POLICY "Permitir insercao apenas para usuarios autenticados"
ON public.escola_acervo FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir atualizacao apenas para usuarios autenticados"
ON public.escola_acervo FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir remocao apenas para usuarios autenticados"
ON public.escola_acervo FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 4. POLICIES: TABELA ESCOLA_AVISOS
-- ------------------------------------------------------------------------------
CREATE POLICY "Permitir leitura publica em avisos"
ON public.escola_avisos FOR SELECT
USING (true);

CREATE POLICY "Permitir insercao apenas para usuarios autenticados"
ON public.escola_avisos FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir atualizacao apenas para usuarios autenticados"
ON public.escola_avisos FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir remocao apenas para usuarios autenticados"
ON public.escola_avisos FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 5. POLICIES: TABELA ESCOLA_DOCUMENTOS
-- ------------------------------------------------------------------------------
CREATE POLICY "Permitir leitura publica em documentos"
ON public.escola_documentos FOR SELECT
USING (true);

CREATE POLICY "Permitir insercao apenas para usuarios autenticados"
ON public.escola_documentos FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir atualizacao apenas para usuarios autenticados"
ON public.escola_documentos FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir remocao apenas para usuarios autenticados"
ON public.escola_documentos FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 6. POLICIES: TABELA ESCOLA_NOTIFICACOES
-- ------------------------------------------------------------------------------
CREATE POLICY "Permitir leitura publica em notificacoes"
ON public.escola_notificacoes FOR SELECT
USING (true);

CREATE POLICY "Permitir insercao apenas para usuarios autenticados"
ON public.escola_notificacoes FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir atualizacao apenas para usuarios autenticados"
ON public.escola_notificacoes FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir remocao apenas para usuarios autenticados"
ON public.escola_notificacoes FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 7. POLICIES: TABELA ESCOLA_CONTEUDO_PAGINAS
-- ------------------------------------------------------------------------------
CREATE POLICY "Permitir leitura publica em conteudos de paginas"
ON public.escola_conteudo_paginas FOR SELECT
USING (true);

CREATE POLICY "Permitir insercao apenas para usuarios autenticados"
ON public.escola_conteudo_paginas FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir atualizacao apenas para usuarios autenticados"
ON public.escola_conteudo_paginas FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir remocao apenas para usuarios autenticados"
ON public.escola_conteudo_paginas FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 8. POLICIES: TABELA ESCOLA_TURMAS
-- ------------------------------------------------------------------------------
CREATE POLICY "Permitir leitura publica em turmas"
ON public.escola_turmas FOR SELECT
USING (true);

CREATE POLICY "Permitir insercao apenas para usuarios autenticados"
ON public.escola_turmas FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir atualizacao apenas para usuarios autenticados"
ON public.escola_turmas FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir remocao apenas para usuarios autenticados"
ON public.escola_turmas FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 9. POLICIES: TABELA ESCOLA_TURMAS_POSTS
-- ------------------------------------------------------------------------------
CREATE POLICY "Permitir leitura publica em turmas posts"
ON public.escola_turmas_posts FOR SELECT
USING (true);

CREATE POLICY "Permitir insercao apenas para usuarios autenticados"
ON public.escola_turmas_posts FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir atualizacao apenas para usuarios autenticados"
ON public.escola_turmas_posts FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL)
WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Permitir remocao apenas para usuarios autenticados"
ON public.escola_turmas_posts FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 10. STORAGE BUCKET SECURITY POLICIES (escola_midias)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Leitura Publica Midias" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Upload Midias Autenticado" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Update Midias Autenticado" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Delete Midias Autenticado" ON storage.objects';
END $$;

CREATE POLICY "Leitura Publica Midias"
ON storage.objects FOR SELECT
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
