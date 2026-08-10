# **🏫 Portal Escolar EEB Professor Benonívio João Martins**

Bem-vindo ao repositório oficial do novo ecossistema digital da **E.E.B. Professor Benonívio João Martins**, localizada em Palhoça/SC.

Este projeto foi construído para modernizar a comunicação da escola, substituindo sistemas legados por uma plataforma rápida, responsiva e de fácil gestão para a equipe escolar.

## **🎯 Visão Geral do Projeto**

A plataforma é dividida em dois universos distintos para garantir segurança, performance e melhor experiência do usuário:

1. **Portal Público:** Voltado para alunos, pais e comunidade. Focado em velocidade e acessibilidade, onde os usuários podem consultar o histórico da escola, acessar documentos públicos, ver os avisos recentes e encontrar rapidamente os canais de contato de cada turma.  
2. **Dashboard Administrativo:** Uma área restrita e segura, desenhada especificamente para a equipe da secretaria e direção. Permite a gestão completa do conteúdo do site de forma visual, sem necessidade de conhecimento técnico.

## **🏗️ Arquitetura e Funcionalidades**

O projeto utiliza o **Next.js App Router** e está estruturado através de *Route Groups* para isolar completamente a lógica e o layout da área pública da área administrativa.

### **🌐 Área Pública (app/(public))**

* **Home:** Visão geral da escola, atalhos rápidos e destaques institucionais.  
* **Avisos:** Mural digital de comunicados importantes para a comunidade escolar.  
* **Sobre:** Informações institucionais, dados do Censo Escolar, localização e a biografia do Patrono.  
* **Acervo:** Resgate da memória da escola, com galerias de fotos históricas e projetos passados.  
* **Documentos:** Repositório de arquivos públicos (Editais, Atas, Guias de Estudo) disponíveis para download direto.  
* **Turmas:** Mapeamento organizado para facilitar o acesso aos grupos de comunicação de cada série.

### **🔒 Área Administrativa (app/(admin))**

Acesso protegido por autenticação (Supabase) via Middleware. O painel inclui gerenciadores (CRUDs) intuitivos para:

* **Gerenciador de Avisos:** Criação e edição de comunicados na página inicial.  
* **Gerenciador de Documentos:** Upload e organização de arquivos (PDFs, Docx).  
* **Gerenciador de Notificações:** Controle de alertas do sistema.  
* **Gerenciador de Páginas:** Controle de conteúdo dinâmico.  
* **Gerenciador de Turmas:** Atualização rápida de links de WhatsApp e informações das turmas.

## **🛠️ Tecnologias Utilizadas**

* **Framework:** Next.js (App Router)  
* **Linguagem:** TypeScript  
* **Estilização e UI:** Tailwind CSS, Radix UI / shadcn/ui (Componentes)  
* **Banco de Dados & Autenticação:** Supabase (PostgreSQL, Auth SSR)  
* **Animações e Scroll:** Framer Motion, Lenis (Smooth Scroll)  
* **Gerenciamento de Estado/Dados:** React Query / Next Server Actions

## **🔗 Deploy**

A plataforma está hospedada na Vercel, aproveitando ao máximo as capacidades de renderização Edge e Serverless do Next.js.

**Acesse o site em produção:** [https://escolabenonivio.vercel.app](https://escolabenonivio.vercel.app)

## **⚖️ Conformidade e Privacidade**

Este portal foi concebido respeitando as normas da **LGPD** e as diretrizes de proteção a menores. Funcionalidades que exigem manipulação de dados sensíveis de alunos são sempre delegadas e redirecionadas para os sistemas oficiais do Governo do Estado de Santa Catarina (SED/SC).
