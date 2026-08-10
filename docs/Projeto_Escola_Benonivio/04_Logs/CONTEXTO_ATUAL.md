# 📌 CONTEXTO ATUAL DO PROJETO - EEB PROFESSOR BENONÍVIO JOÃO MARTINS

**Última Atualização:** 10 de Agosto de 2026  
**Status do Projeto:** Em Desenvolvimento Ativo / Histórico Git Resetado e Blindado / SEO & Acervo Concluídos  
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
- **Backend & Banco de Dados:** Supabase (PostgreSQL, Row Level Security - RLS, Auth, Realtime)
- **Armazenamento de Mídias:** Supabase Storage (`escola_midias` bucket)
- **Hospedagem & Deploy:** Vercel (`https://escolabenonivio.vercel.app`)

---

## 🛡️ 2. Arquitetura de Segurança, Reset Git e Blindagem

1. **Reset do Histórico do Git (Purga de Segredos):**
   - Árvore de commits antiga destruída e substituída por um repositório limpo (`chore: reset git history for security and update architecture`).
   - Push forçado (`git push -u origin main --force`) realizado para purgar permanentemente qualquer credencial exposta em commits passados.
2. **Proteção no Git (`.gitignore`):**
   - Inclusão rigorosa de `docs/**/.obsidian/`, `docs/**/Segurança.md` e `docs/**/Senhas.md` nos arquivos `.gitignore` (raiz e secundário).
3. **Validação de Storage & Mídias (`lib/storage-security.ts`):**
   - Whitelist estrita de MIME types (JPEG, PNG, WebP, GIF, AVIF, PDF, DOC, DOCX, XLS, XLSX).
   - Limite estrito de tamanho: **5 MB** para imagens e **10 MB** para documentos.
   - Mitigação de Pixel Flood / Image Bomb (máximo 4096px por dimensão / 16 Megapixels).
   - Sanitização criptográfica de nomes de arquivo (Crypto UUID).
4. **Controle de Acesso & RLS (`RLS_policies.sql`):**
   - Leitura pública ativada apenas para itens publicados em `escola_turmas`, `escola_documentos` e `escola_avisos`.
   - Modificação (INSERT, UPDATE, DELETE) restrita exclusivamente a usuários autenticados via Supabase Auth.

---

## 🚀 3. Implementações Concluídas (Ponta a Ponta)

- [x] **Bugfix de Contato e WhatsApp (`lib/constants.ts` & `whatsapp-dialog.tsx`):**
  - Número oficial do WhatsApp corrigido para `+55 48 98835-4422` em todo o projeto.
  - Telefone fixo da secretaria mantido: `(48) 3665-5774`.
- [x] **Infraestrutura Técnica de SEO (Google Search Console):**
  - `app/sitemap.ts`: Gerador dinâmico de sitemap para rotas públicas.
  - `app/robots.ts`: Configuração com `Disallow: /dashboard/`.
  - Verificação Google Search Console via `public/googled9f9ab4eae780ffe.html`.
- [x] **Acervo Digital, Podcasts & Revista Okaza (`app/(public)/acervo/page.tsx`):**
  - Componente `<SpotifyEmbed />` ([components/features/spotify-embed.tsx](file:///c:/Projetos/escola-benonivio/components/features/spotify-embed.tsx)): Player dinâmico com os 6 episódios gravados do podcast do 3º ano.
  - Componente `<RevistaOkazaCard />` ([components/features/revista-okaza-card.tsx](file:///c:/Projetos/escola-benonivio/components/features/revista-okaza-card.tsx)): Downloads das edições #1 (2019) e #2 (2020) + regras de submissão da APP.
- [x] **Painel Administrativo ("Beno Painel" `/dashboard`):**
  - Módulos funcionais para gestão de Turmas, Documentos, Mural de Avisos e Páginas.
- [x] **Manual do Administrador & Documentação:**
  - `docs/Projeto_Escola_Benonivio/02_Wiki/MANUAL_ADMIN.md`: Guia completo e didático com regra de atualização contínua para agentes.

---

## 📊 4. Gap Analysis (Requisitos Puros x Código Atual)

| Item / Funcionalidade Bruta | Origem em `01_Raw_Sources` | Estado Atual no Código | Status / Ação Recomendada |
| :--- | :--- | :--- | :--- |
| **Embed / Player Podcast Spotify** | `SiteLegado_Grupo_Estudos.md` | **CONCLUÍDO** | Componente `<SpotifyEmbed />` implementado na rota `/acervo`. |
| **Revista Okaza (Links & Regras)** | `SiteLegado_Revista_Okaza.md` | **CONCLUÍDO** | Componente `<RevistaOkazaCard />` implementado na rota `/acervo`. |
| **Injeção de Dados do INEP/SAEB/Censo** | `Dossiê Histórico-Estatístico.md` & `Portal_SED_DadosOficiais.md` | Dados parciais em `/sobre` | Próxima sprint: expandir `/sobre` com tabela histórica de proficiência SAEB/IDEB. |
| **Feed / Widget API Instagram** | `Mapeamento_Turmas_WhatsApp.md` & Dossiê | Apenas link externo | Widget/Feed do `@escolabenonivio` pendente de token de API. |
| **Iniciativas Estudantis (Grupo Butterfly & COM-VIDA)** | `SiteLegado_Grupo_Butterfly.md` | Não detalhado | Adicionar seção de "Projetos Estudantis" em `/sobre`. |

---

## 📝 5. Instruções para Próximos Chats / Agentes

Sempre que iniciar uma nova sessão ou alterar o código:
1. Abra este arquivo (`docs/Projeto_Escola_Benonivio/04_Logs/CONTEXTO_ATUAL.md`) para se situar sobre o estado do projeto.
2. Atualize [MANUAL_ADMIN.md](file:///c:/Projetos/escola-benonivio/docs/Projeto_Escola_Benonivio/02_Wiki/MANUAL_ADMIN.md) sempre que modificar rotas ou formulários administrativos.
3. Mantenha a tabela de Gap Analysis atualizada.
