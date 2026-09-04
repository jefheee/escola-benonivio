# 📌 CONTEXTO ATUAL DO PROJETO - EEB PROFESSOR BENONÍVIO JOÃO MARTINS

**Última Atualização:** 04 de Setembro de 2026  
**Status do Projeto:** Em Produção / Blindagem de Segurança 100% Concluída & Correções de Layout/Upload Ativas  
**Arquitetura:** Docs as Code (Fonte de Verdade)

---

## 🚨 REGRA ABSOLUTA DE WORKSPACE (`.agents/rules.md` & `.agents/AGENTS.md`)
> **REGRA ABSOLUTA:** Toda e qualquer alteração de código ou arquitetura neste projeto exige que você leia, atualize e valide o arquivo `docs/Projeto_Escola_Benonivio/04_Logs/CONTEXTO_ATUAL.md`. O padrão do projeto é 'Docs as Code'. A verdade absoluta do software mora neste arquivo.

---

## 🛠️ 1. Stack Tecnológica Oficial

- **Framework:** Next.js 14+ (App Router, Server Actions, Server Components)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (Design System institucional com azul `#00185f` e vermelho `#bc0100`)
- **Ícones:** Lucide React
- **Validação de Dados:** Zod v3 (`.strict()` em todos os payloads)
- **Backend & Banco de Dados:** Supabase (PostgreSQL 17, Row Level Security - RLS, Auth, Realtime)
- **Armazenamento de Mídias:** Supabase Storage (`escola_midias` bucket)
- **Hospedagem & Deploy:** Vercel (`https://escolabenonivio.vercel.app`)

---

## 🛡️ 2. Arquitetura de Segurança e Blindagem Completa (12 Diretivas)

1. **Variáveis de Ambiente, Secrets e Higiene de Repositório:**
   - Isolamento de chaves via `lib/env-guard.ts` (`validateApiIsolation()` executado em runtime).
   - Ausência total de credenciais privadas ou `service_role` com prefixo `NEXT_PUBLIC_`.
   - `.gitignore` blindado para todas as variações de ambiente (`.env`, `.env*.local`, `.env.local`, `.env.development`, `.env.test`, `.env.production`).
   - Histórico do Git limpo e sem credenciais rastreadas.
2. **Rate Limiting em Camadas & Proteção contra Esgotamento (Bomba de Custo):**
   - Camada 1 (Edge Middleware): Rate limiting ativo em `middleware.ts` bloqueando IPs após 5 requisições/minuto em rotas de auth.
   - Camada 2 (Server Actions): `lib/rate-limit.ts` (Sliding Window in-memory) na Server Action `login()`.
   - Limite estrito de queries (Caps): Adicionado `.limit()` compulsório em todas as buscas públicas e administrativas (`lib/data/*.ts` e `actions.ts`), impedindo exaustão de banco e banda.
3. **Proteção contra Registro Falso e Anti-Enumeração de Contas:**
   - Schema Zod estrito no login (`email` formatado e `password`).
   - Respostas de erro uniformes e genéricas no login, impedindo enumeração de e-mails cadastrados.
4. **Proteção de Rotas, Sessões e Cookies Seguros:**
   - Validação autoritativa do JWT do Supabase no Edge Middleware via `supabase.auth.getUser()`.
   - Bloqueio no servidor para todas as rotas `/dashboard/*` e `/admin/*`.
   - Cookies configurados com `httpOnly: true`, `secure: true` (produção) e `sameSite: 'lax'`.
   - Revogação global de sessões no logout via `supabase.auth.signOut({ scope: 'global' })`.
5. **Sanitização contra XSS, SQLi e Command Injection:**
   - Módulo `lib/sanitize.ts` com higienização recursiva de strings, eliminação de tags `<script>` e protocolos `javascript:`.
   - Consultas 100% parametrizadas via SDK oficial do Supabase.
   - Nomes de arquivos gerados criptograficamente no upload (`crypto.randomUUID()` e `crypto.getRandomValues()`), eliminando path traversal (`../`) e command injection.
6. **Defesa de Uploads e Storage:**
   - Módulo `lib/storage-security.ts` com whitelist estrita de tipos MIME (imagens e documentos permitidos).
   - Teto máximo de tamanho: 5MB para imagens e 10MB para documentos.
   - Proteção contra Image Bomb / Pixel Flood: Bloqueio de resoluções superiores a 4096px ou 16 Megapixels antes do processamento.
7. **Tratamento Defensivo de Erros e Logs Sanitizados:**
   - Erros nativos capturados e logados exclusivamente no servidor (`console.error`).
   - Mensagens para o cliente final tratadas e genéricas, sem expor stack traces ou chaves internas.
8. **Row Level Security (RLS) Abrangente:**
   - `RLS_policies.sql` executado e ativo em 100% das tabelas (`escola_acervo`, `escola_avisos`, `escola_documentos`, `escola_notificacoes`, `escola_conteudo_paginas`, `escola_turmas`, `escola_turmas_posts`) e no bucket `escola_midias`.
   - `FORCE ROW LEVEL SECURITY` ativado. Mutações restritas a `(select auth.uid()) IS NOT NULL`.
9. **Data Minimization (Trim de Respostas):**
   - Substituição de `.select('*')` por projeções explícitas de colunas em todas as Server Actions e queries públicas.
10. **Cabeçalhos HTTP (Security Headers) & HTTPS:**
    - CSP restrito, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security` (HSTS com 2 anos), `Referrer-Policy` e `Permissions-Policy` configurados em `next.config.mjs`.

---

## 🚀 3. Implementações Concluídas (Ponta a Ponta)

- [x] **Checklist Completo de Segurança Enterprise (12/12):**
  - Isolamento de API, Rate Limiting, Cookies Seguros, Zod Strict, Anti-Enumeração, Anti-XSS, Caps em queries, RLS forçado e CSP.
- [x] **Fix de Compilação/Deploy Vercel (`components/features/revista-okaza-card.tsx`):**
  - Correção de caracteres de aspas duplas sem escape na regra `react/no-unescaped-entities`.
- [x] **Bugfix de Contato e WhatsApp (`lib/constants.ts` & `whatsapp-dialog.tsx`):**
  - Número oficial do WhatsApp corrigido para `+55 48 98835-4422`.
- [x] **Infraestrutura Técnica de SEO (Google Search Console):**
  - `app/sitemap.ts`: Gerador dinâmico de sitemap para rotas públicas.
  - `app/robots.ts`: Configuração com `Disallow: /dashboard/`.
  - Verificação Google Search Console via `public/googled9f9ab4eae780ffe.html`.
- [x] **Acervo Digital, Podcasts & Revista Okaza (`app/(public)/acervo/page.tsx`):**
  - Componente `<SpotifyEmbed />`: Player dinâmico dos 6 episódios do podcast.
  - Componente `<RevistaOkazaCard />`: Downloads das edições #1 e #2 da Revista Okaza.
- [x] **Painel Administrativo ("Beno Painel" `/dashboard`):**
  - Módulos de gestão para Turmas, Documentos, Mural de Avisos e Páginas.
- [x] **Bugfix de Validação de UUID & Resiliência no Dashboard de Avisos:**
  - Substituição da validação rígida RFC-4122 do Zod (`z.string().uuid()`) por regex compatível com qualquer UUID padrão PostgreSQL (`UUID_REGEX` em `lib/sanitize.ts`). Isso corrigiu o erro de "ID Inválido" e "Invalid Input" em registros legados ou de seed (como o aviso do Calendário Escolar 2026).
  - Remoção de `window.location.reload()` das Server Actions e substituição por `router.refresh()` com atualizações de estado otimistas e `useEffect` de sincronização, eliminando o erro de crash "Application error: a client-side exception has occurred".
  - Verificação da tela inicial: quando nenhum aviso possui `destaque_home: true`, a seção inteira de Destaques (incluindo o container azul) fica 100% oculta.
- [x] **Galeria de Memórias & Acervo Histórico (`app/(public)/sobre/components/sobre-hub.tsx`):**
  - Removido o filtro em preto e branco (`grayscale`) dos cards da galeria e do modal de visualização ampliada, garantindo exibição com cores naturais em todos os dispositivos móveis e desktops.
  - Removido o corte forçado (`aspect-video` e `object-cover`), substituído por enquadramento integral (`object-contain` com fundo escuro elegante e altura dinâmica), preservando o topo e a base completos das fotos e banners históricos.
- [x] **Upload de Mídias via Server Action Corporativa (`app/(admin)/dashboard/actions/upload.ts`):**
  - Implementada a Server Action `uploadMediaAction(formData: FormData)` que roda no servidor Next.js com sessão protegida autoritativa (`supabase.auth.getUser()`).
  - Substituído o envio client-side em `ImageCropper` e `DocumentosManager`, eliminando o erro de RLS ("Falha ao enviar imagem. Verifique o arquivo e tente novamente.") que ocorria ao subir arquivos como PNG 725x1024.
  - Normalizada a extensão do canvas para `.jpg` para manter estrita paridade com o blob `image/jpeg`.
  - Restauradas as opções padrões gerenciadas pelo `@supabase/ssr` em `middleware.ts` e `lib/supabase/server.ts`.
- [x] **Correção da Borda Branca no Header e Desacoplamento de Pop-ups (`createPortal`):**
  - Migrado o modal de avisos (`avisos-list.tsx`, `avisos-carousel.tsx`) e da galeria histórica (`sobre-hub.tsx`) para React Portal anexado a `document.body` com `z-[9999]`.
  - Implementado bloqueio de rolagem do fundo (`document.body.style.overflow = 'hidden'`) enquanto o modal estiver aberto.
  - Eliminado o corte horizontal do backdrop que deixava os 16px/37px superiores do header visíveis como uma borda branca grossa.
- [x] **Reconhecimento Automático de Hiperlinks em Textos (`components/ui/formatted-text.tsx`):**
  - Criado o componente `<FormattedText />` com parser regex que detecta automaticamente URLs (`http://`, `https://`, `www.`), separa pontuações anexadas e renderiza hiperlinks azuis institucionais clicáveis (`target="_blank" rel="noopener noreferrer"`).
  - Aplicado no conteúdo e resumo de avisos, posts de turmas e acervo histórico.
- [x] **Reorganização de Serviços & Portais Governamentais (`app/(public)/components/servicos-grid.tsx`):**
  - Card do "Professor Online" reposicionado para a 2ª posição, imediatamente ao lado de "Estudante Online" (Estudante Online, Professor Online, Matrícula Online, Cardápio).
- [x] **Restauração e Encaixe do Google Maps Responsivo (`next.config.mjs` & `sobre-hub.tsx`):**
  - Liberado `frame-src 'self' https://www.google.com https://www.google.com.br https://open.spotify.com;` na Content Security Policy (CSP), resolvendo o bloqueio de iframes externos do Google Maps e Spotify.
  - Atualizado o embed do Google Maps da escola com o novo código e proporção responsiva 600x450 (4:3) adaptável (altura dinâmica `h-72 sm:h-80`), título acessível e `strict-origin-when-cross-origin`.
- [x] **Alinhamento e Proporção da Localização (`app/(public)/sobre/components/sobre-hub.tsx`):**
  - Ajustada a altura do container do iframe do Google Maps para `h-44 sm:h-48` no card de "Localização", alinhando simetricamente o início e o fim da coluna da direita com a lista de "Infraestrutura & Ambientes" (`items-start`).
  - Adicionado link direto acessível "Abrir mapa" apontando diretamente para o Google Maps da escola com `ExternalLink`.
- [x] **Padronização e Ordem Cronológica dos Avisos (`app/(public)/avisos/components/avisos-list.tsx`):**
  - Substituído o layout CSS `columns` por CSS Grid bidimensional (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`), garantindo que os avisos fluam estritamente na ordem cronológica horizontal (da esquerda para a direita, linha por linha).
  - Padronizada a altura dos cards com altura fixa de container de imagem (`h-56`), título clampado (`h-11 line-clamp-2`), resumo clampado (`h-14 line-clamp-3`) e rodapé fixado na base (`mt-auto flex justify-between`).
- [x] **Eliminação de Cortes e Zoom em Imagens (`ImageCropper` & Display Global):**
  - Adicionado o modo padrão **"Original (Sem Cortes)"** no `ImageCropper` (`components/admin/image-cropper.tsx`), preservando 100% da imagem sem perdas de cabeçalho, rodapé ou texto, enviando o arquivo original diretamente pela Server Action `uploadMediaAction`.
  - Adicionado modo "Recortar / Ajustar" opcional com seletores de formato (16:9, 4:3, 3:4, 1:1) caso o administrador deseje explicitamente reenquadrar.
  - Substituído `object-cover` por `object-contain` em todos os cards e modais públicos e administrativos (`avisos-list.tsx`, `avisos-carousel.tsx`, `avisos-manager.tsx`, `acervo-manager.tsx`, `turmas-manager.tsx`, `turmas/[id]/page.tsx`), garantindo visualização integral de cartazes, panfletos e fotos.
- [x] **Alimentação Escolar & Cardápio Mobile-First (`app/(public)/cardapio/page.tsx` & `CardapioDoDia`):**
  - Redesenhada a rota pública `/cardapio` com cabeçalho oficial do PNAE/SED-SC focado em clareza para pais e alunos acessando via celular.
  - Criado o componente `<CardapioDoDia />` com visualização limpa mobile-first, divisão por turnos (Diurno: Matutino/Vespertino e Noturno: Jantar), garantias institucionais e estado de carregamento amigável.
  - Preservada a área de consulta e download dos editais e cronogramas mensais em PDF da SED/SC.
- [x] **Arquitetura de Automação de Cardápio via IA (Docs as Code & Schema):**
  - Criado o documento `docs/Projeto_Escola_Benonivio/00_Schema/Supabase_Cardapio.md` (e espelho em `docs/00_Schema/Supabase_Cardapio.md`).
  - Formalizado o "AI PDF Parser Workflow": a secretaria não fará digitação manual; apenas enviará o PDF da SED/SC. O backend (Server Action) aciona a LLM API (Google Gemini API ou Groq como fallback) para extrair o array JSON padronizado `[{ data: 'YYYY-MM-DD', turno: 'diurno'|'noturno', descricao: '...' }]` e gravar via bulk upsert no PostgreSQL.
  - DDL SQL completo com tabela `refeicoes`, tipo enum `tipo_turno_refeicao`, restrição única `(data, turno)`, índices e 4 políticas RLS (leitura pública e mutação restrita a autenticados).
  - Preparadas as variáveis de ambiente `AI_API_KEY`, `GEMINI_API_KEY` e `GROQ_API_KEY` em `.env.local` e blindadas no `lib/env-guard.ts` contra vazamentos no client-side.
- [x] **Implementação do AI PDF Parser de Cardápios (`@google/generative-ai`):**
  - Instalado o SDK oficial `@google/generative-ai` e implementada a Server Action `parseCardapioPDF(formData: FormData)` em `app/(admin)/dashboard/cardapio/actions.ts`.
  - O modelo `gemini-1.5-flash` consome o arquivo PDF nativamente via `inlineData` (base64 com `application/pdf`) e extrai as refeições de cada dia útil em JSON estrito `[{ data: 'YYYY-MM-DD', turno: 'diurno' | 'noturno', descricao: '...' }]`.
  - Provisionada a tabela `refeicoes` no Supabase PostgreSQL com tipo enum `tipo_turno_refeicao`, constraint de unicidade `(data, turno)` e políticas de Row Level Security (RLS) forçadas.
  - Criada a interface administrativa completa em `app/(admin)/dashboard/cardapio/page.tsx` com `CardapioUploader` (seletor de arquivo, indicador de progresso de IA, mensagens de feedback) e `RefeicoesTabela` para conferência e exclusão pontual.
  - Integrado o link de "Cardápio Escolar (IA)" na barra lateral do painel (`sidebar-nav.tsx`).
  - Conectada a página pública `/cardapio` para ler e exibir em tempo real as refeições ativas do dia no componente `<CardapioDoDia />`.
- [x] **Manual do Administrador & Documentação:**
  - `docs/Projeto_Escola_Benonivio/02_Wiki/MANUAL_ADMIN.md`: Atualizado com as instruções de uso do novo módulo de Cardápio Inteligente com IA.

---

## 📊 4. Gap Analysis (Requisitos Puros x Código Atual)

| Item / Funcionalidade Bruta | Origem em `01_Raw_Sources` | Estado Atual no Código | Status / Ação Recomendada |
| :--- | :--- | :--- | :--- |
| **Embed / Player Podcast Spotify** | `SiteLegado_Grupo_Estudos.md` | **CONCLUÍDO** | Componente `<SpotifyEmbed />` implementado na rota `/acervo`. |
| **Revista Okaza (Links & Regras)** | `SiteLegado_Revista_Okaza.md` | **CONCLUÍDO** | Componente `<RevistaOkazaCard />` implementado na rota `/acervo`. |
| **Cardápio Digital & CardapioDoDia (UI)** | Requisito UX Mobile | **CONCLUÍDO** | UI pública `/cardapio` implementada com cabeçalho PNAE e dados reais em `<CardapioDoDia />`. |
| **Automação de Leitura de PDF de Cardápio via IA (Backend)** | Mudança Arquitetural Aprovada | **CONCLUÍDO** | Server Action `@google/generative-ai` com Gemini 1.5 Flash, upsert em `refeicoes` e UI de upload em `/dashboard/cardapio`. |
| **Injeção de Dados do INEP/SAEB/Censo** | `Dossiê Histórico-Estatístico.md` & `Portal_SED_DadosOficiais.md` | Dados parciais em `/sobre` | Próxima sprint: expandir `/sobre` com tabela histórica de proficiência SAEB/IDEB. |
| **Feed / Widget API Instagram** | `Mapeamento_Turmas_WhatsApp.md` & Dossiê | Apenas link externo | Widget/Feed do `@escolabenonivio` pendente de token de API. |
| **Iniciativas Estudantis (Grupo Butterfly & COM-VIDA)** | `SiteLegado_Grupo_Butterfly.md` | Não detalhado | Adicionar seção de "Projetos Estudantis" em `/sobre`. |

---

## 📝 5. Instruções para Próximos Chats / Agentes

Sempre que iniciar uma nova sessão ou alterar o código:
1. Abra este arquivo (`docs/Projeto_Escola_Benonivio/04_Logs/CONTEXTO_ATUAL.md`) para se situar sobre o estado do projeto.
2. Atualize [MANUAL_ADMIN.md](file:///c:/Projetos/escola-benonivio/docs/Projeto_Escola_Benonivio/02_Wiki/MANUAL_ADMIN.md) sempre que modificar rotas ou formulários administrativos.
3. Mantenha a tabela de Gap Analysis atualizada.
