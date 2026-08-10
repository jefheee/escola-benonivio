# Contexto Inicial: Projeto Portal EEB Benonívio João Martins

Atue como Engenheiro de Software Sênior especializado em Next.js 14 (App Router), TypeScript, Tailwind CSS e arquiteturas de alta performance para a Vercel.

## 1. Escopo do Projeto
O objetivo é desenvolver o portal oficial da escola pública estadual EEB Professor Benonívio João Martins. O site servirá como hub centralizador, resolvendo a fragmentação de comunicação atual. Deve ser extremamente rápido (SSG/ISR), acessível e com custo zero de manutenção.

## 2. Stack Tecnológica Obrigatória
- **Framework:** Next.js 14+ (App Router).
- **Linguagem:** TypeScript (Tipagem estrita obrigatória).
- **Estilização:** Tailwind CSS (com utilização de `clsx` e `tailwind-merge` para classes dinâmicas).
- **Ícones:** `lucide-react`.
- **Componentização:** Componentes Funcionais do React.

## 3. Diretrizes Arquiteturais (Não Negociáveis)
1. **Server Components por Padrão:** Todo componente deve ser um React Server Component (RSC), a menos que necessite de estado (`useState`), ciclo de vida (`useEffect`) ou eventos de DOM (`onClick`). Apenas nestes casos, declare `"use client"` no topo do arquivo.
2. **Integração Instagram (Feed de Avisos):** A página inicial deve consumir a Graph API do Instagram no servidor para não onerar o cliente. Utilize a tag de fetch do Next.js `{ next: { revalidate: 3600 } }` para gerar cache estático (ISR) renovado a cada 1 hora. Não utilize widgets de terceiros (como Elfsight).
3. **Acervo Histórico e Galerias:** Os álbuns de fotos passados utilizarão links de redirecionamento direto para o Google Photos. O conteúdo histórico (Projetos de 2020) será renderizado estaticamente (SSG) na rota `/acervo`.
4. **Organização de Pastas:** Utilize a estrutura de diretórios baseada em *features* ou domínios dentro de `app/`:
   - `app/(routes)/` (Para organização de páginas, ex: `app/(routes)/sobre/page.tsx`)
   - `components/ui/` (Botões, Cards genéricos)
   - `components/layout/` (Header, Footer, Navegação)
   - `components/features/` (Componentes específicos, ex: `<TurmasGrid />`, `<InstagramFeed />`)
   - `lib/` (Funções utilitárias, constantes e configurações)

## 4. O que você deve fazer agora (Sua primeira entrega)
Entregue os comandos de terminal (`npx create-next-app...`) com as flags corretas para iniciar o projeto sem pausas interativas, e em seguida entregue o código completo da configuração do Layout Base (`app/layout.tsx`), do Header (`components/layout/header.tsx`) e da tipagem das variáveis globais (`lib/constants.ts`) contendo as informações oficiais da escola (Endereço, MEC, WhatsApp). Não explique as ferramentas, apenas entregue o código funcional e pronto para uso.