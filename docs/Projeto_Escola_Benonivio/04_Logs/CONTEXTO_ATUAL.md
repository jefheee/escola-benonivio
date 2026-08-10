# 📌 CONTEXTO ATUAL DO PROJETO - EEB PROFESSOR BENONÍVIO JOÃO MARTINS

**Última Atualização:** 10 de Agosto de 2026  
**Status do Projeto:** Em Desenvolvimento Ativo / Fase de Consolidação e SEO  
**Arquitetura:** Docs as Code (Fonte de Verdade)

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

## 🛡️ 2. Arquitetura de Segurança e Blindagem

1. **Proteção no Git (`.gitignore`):**
   - Inclusão rigorosa de `docs/**/.obsidian/`, `docs/**/Segurança.md` e `docs/**/Senhas.md` no `.gitignore` raiz e secundário.
   - Remoção dos arquivos sensíveis do rastreamento/indexação do git.
2. **Validação de Storage & Mídias (`lib/storage-security.ts`):**
   - Whitelist estrita de MIME types (JPEG, PNG, WebP, GIF, AVIF, PDF, DOC, DOCX, XLS, XLSX).
   - Limite estrito de tamanho: **5 MB** para imagens e **10 MB** para documentos.
   - Mitigação de Pixel Flood / Image Bomb (máximo 4096px por dimensão / 16 Megapixels).
   - Sanitização criptográfica de nomes de arquivo (Crypto UUID) contra Injeção de Comandos e Path Traversal.
3. **Controle de Acesso & RLS (`RLS_policies.sql`):**
   - Leitura pública ativada apenas para itens publicados em `escola_turmas`, `escola_documentos` e `escola_avisos`.
   - Modificação (INSERT, UPDATE, DELETE) restrita exclusivamente a usuários autenticados via Supabase Auth.
4. **Proteção Operacional (`lib/env-guard.ts` & `lib/rate-limit.ts`):**
   - Validação de variáveis de ambiente no startup.
   - Rate limit configurado para formulários e Server Actions.

---

## 🚀 3. Implementações Concluídas (Ponta a Ponta)

- [x] **Dados Institucionais Unificados (`lib/constants.ts`):**
  - Número oficial do WhatsApp corrigido para `+55 48 98835-4422` em todo o projeto.
  - Telefone fixo da secretaria mantido: `(48) 3665-5774`.
  - INEP oficial: `000042004047`.
  - Endereço oficial: `Rua Monsenhor Roberto Landel Moura, S/N - Brejaru I, Palhoça - SC, CEP 88133-490`.
- [x] **Infraestrutura Técnica de SEO (Google Search Console):**
  - `app/sitemap.ts`: Gerador dinâmico de sitemap para rotas públicas (`/`, `/sobre`, `/acervo`, `/avisos`, `/documentos`, `/turmas`).
  - `app/robots.ts`: Regras de indexação liberando rotas públicas e bloqueando `/dashboard/`.
  - Verificação Google Search Console ativada via `public/googled9f9ab4eae780ffe.html`.
- [x] **Painel Administrativo ("Beno Painel" `/dashboard`):**
  - Módulo de login e autenticação em `app/(admin)/login`.
  - Dashboard centralizador com métricas em tempo real (`/dashboard`).
  - Gestão e edição de turmas e links de WhatsApp (`/dashboard/turmas`).
  - Gestão de documentos públicos com upload seguro (`/dashboard/documentos`).
  - Mural de avisos com categorização e níveis de prioridade (`/dashboard/avisos`).
- [x] **Documentação & Manuais (`docs/`):**
  - `docs/02_Wiki/MANUAL_ADMIN.md`: Guia completo e didático voltado para diretoras e secretárias.
  - Configuração de regras automáticas para novos agentes em `.agents/rules/docs_as_code.md` e `.agents/AGENTS.md`.

---

## 📊 4. Gap Analysis (Requisitos Puros x Código Atual)

A tabela abaixo cruza as fontes brutas (`docs/01_Raw_Sources/`) com o estado atual do código-fonte para orientar as próximas sprints:

| Item / Funcionalidade Bruta | Origem em `01_Raw_Sources` | Estado Atual no Código | Ação Recomendada / Próximo Passo |
| :--- | :--- | :--- | :--- |
| **Embed / Widget Spotify** | `SiteLegado_Grupo_Estudos.md` | Ausente na UI atual | Criar componente `<SpotifyEmbed />` na rota `/acervo` ou `/sobre` para reproduzir os 6 episódios do podcast do 3º ano. |
| **Revista Okaza (Links & Submissões)** | `SiteLegado_Revista_Okaza.md` | Ausente na UI atual | Adicionar seção/card dedicado no Acervo Digital com links dos PDFs de 2019 e 2020 e regras de submissão da APP. |
| **Injeção de Dados do INEP/SAEB/Censo** | `Dossiê Histórico-Estatístico.md` & `Portal_SED_DadosOficiais.md` | Dados parciais em `/sobre` | Expandir `/sobre` com tabela histórica de proficiência SAEB/IDEB, histórico do patrono Benonívio e fundação do Brejaru. |
| **Feed / Widget API Instagram** | `Mapeamento_Turmas_WhatsApp.md` & Dossiê | Apenas link externo | Implementar widget ou integração de feed para exibir postagens recentes do `@escolabenonivio`. |
| **Iniciativas Estudantis (Grupo Butterfly & COM-VIDA)** | `SiteLegado_Grupo_Butterfly.md` | Não detalhado | Criar aba de "Projetos Estudantis" em `/sobre` destacando o Grupo Butterfly e o Programa COM-VIDA. |
| **Formulário de Solicitação de Recurso APP** | `SiteLegado_APP.md` | Apenas cadastro de documentos genericos | Criar modelo/template em PDF para download de solicitação de recursos da APP e estatuto social. |

---

## 📝 5. Instruções para Próximos Chats / Agentes

Sempre que iniciar uma nova sessão ou alterar o código:
1. Abra este arquivo (`docs/Projeto_Escola_Benonivio/04_Logs/CONTEXTO_ATUAL.md`) para se situar sobre o estado do projeto.
2. Registre novos componentes, Server Actions ou tabelas criadas nas seções correspondentes.
3. Mantenha a tabela de Gap Analysis atualizada conforme os pendentes forem transformados em código.
