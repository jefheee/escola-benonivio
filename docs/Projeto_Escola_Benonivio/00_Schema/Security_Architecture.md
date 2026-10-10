# Arquitetura de Segurança & Blindagem Corporativa (Security Rules)

**Projeto:** EEB Professor Benonívio João Martins  
**Stack:** Next.js 14 App Router, Supabase PostgreSQL 17, TypeScript 5, Tailwind CSS  
**Padrão:** Docs as Code

---

## 1. Diretrizes de Row Level Security (RLS) no Supabase

Todas as tabelas do PostgreSQL e buckets de storage operam sob `ROW LEVEL SECURITY` forçado (`ALTER TABLE ... FORCE ROW LEVEL SECURITY`).

### 1.1 Políticas de Leitura Pública (`SELECT`)
- O papel público (`anon`) **nunca** deve possuir permissão irrestrita `USING (true)` em tabelas com ciclo de vida de publicação ou status de moderação.
- Tabelas com publicação (`escola_avisos`, `escola_acervo`, `escola_turmas_posts`):
  ```sql
  CREATE POLICY "Leitura Publica ..." ON <table> FOR SELECT TO anon
  USING (status = 'ativo' AND (data_publicacao IS NULL OR data_publicacao <= CURRENT_TIMESTAMP));
  ```
- Tabelas com ativação booleana (`escola_notificacoes`):
  ```sql
  CREATE POLICY "Leitura Publica Notificacoes Ativas" ON escola_notificacoes FOR SELECT TO anon
  USING (ativa = true);
  ```
- Tabelas de domínio público institucional (`escola_turmas`, `escola_documentos`, `escola_conteudo_paginas`, `refeicoes`):
  ```sql
  CREATE POLICY "Leitura Publica ..." ON <table> FOR SELECT TO public
  USING (true);
  ```

### 1.2 Políticas Administrativas (`authenticated`)
- Usuários autenticados no Supabase possuem leitura total das tabelas administrativas:
  ```sql
  CREATE POLICY "Admin Leitura ..." ON <table> FOR SELECT TO authenticated
  USING (true);
  ```
- Mutações (`INSERT`, `UPDATE`, `DELETE`) são estritamente condicionadas à sessão válida:
  ```sql
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);
  ```

---

## 2. Server Actions & Controle de Acesso Autoritativo (Backend)

1. **Validação Obrigatória em Ações de Leitura:**
   - Funções exportadas com `'use server'` são endpoints RPC abertos para requisições com cabeçalho `Next-Action`.
   - Todas as Server Actions administrativas de leitura (`get*Admin`) **devem** validar explicitamente a sessão do usuário:
     ```typescript
     const { data: { user }, error: authError } = await supabase.auth.getUser();
     if (authError || !user) {
       throw new Error('Acesso não autorizado.');
     }
     ```
2. **Prevenção de IDOR via Filtros Compostos:**
   - Em operações que mutam entidades filhas (ex: `escola_turmas_posts` vinculadas a `turma_id`), o filtro da query **deve** incluir obrigatoriamente a chave primária e a chave estrangeira do relacionamento:
     ```typescript
     await supabase
       .from('escola_turmas_posts')
       .update(...)
       .eq('id', validId.data)
       .eq('turma_id', validTurmaId.data);
     ```

---

## 3. Sanitização contra XSS e Validação de URLs

1. **Sanitização Recursiva de Strings:**
   - Módulo centralizado em `lib/sanitize.ts`.
   - Limpeza em loop recursivo (`while (prev !== sanitized)`) para impedir desativação por payloads aninhados como `javajavascript:script:alert(1)`.
2. **Validação Estrita de Protocolos HTTP/HTTPS:**
   - Schemas Zod que recebem links devem utilizar `isValidSafeUrl` para barrar esquemas arbitrários (`javascript:`, `data:`, `vbscript:`):
     ```typescript
     url: z.string().refine(isValidSafeUrl, 'URL deve utilizar o protocolo https:// ou http://')
     ```
3. **Renderização Segura no Frontend:**
   - Hiperlinks dinâmicos (`<a href={...}>`) devem sempre passar pela função `sanitizeHref(url)` para garantir fallback para `'#'` caso algum dado inseguro seja inserido.

---

## 4. Proteção de Segredos & Build-Time Guard

1. **Guarda em Tempo de Compilação (`next.config.mjs`):**
   - Durante `next build`, todas as variáveis de ambiente com prefixo `NEXT_PUBLIC_` são inspecionadas.
   - Caso qualquer chave contenha assinaturas de segredos (`service_role`, `sk_live`, `AIzaSy`, `gemini_api_key`), o build é abortado com erro crítico antes da geração de bundles estáticos.
2. **Clientes Supabase com Fail-Fast (`lib/supabase/public.ts`):**
   - Singleton `supabasePublic` valida a presença de variáveis obrigatórias e aborta de forma explícita caso não estejam configuradas.
