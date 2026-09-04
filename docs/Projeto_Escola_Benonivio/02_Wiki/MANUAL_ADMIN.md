# 📖 Manual do Administrador - EEB Professor Benonívio João Martins

> [!IMPORTANT]
> **Nota para Agentes de Código & Desenvolvedores (Docs as Code):**  
> Este manual é a documentação viva da interface do usuário administrativo. Toda vez que uma nova funcionalidade, botão, rota ou trava de segurança for alterada no código-fonte, o agente responsável **DEVE atualizar imediatamente este manual** para manter a secretaria e direção escolar instruídas corretamente.

---

## 📌 1. Como Acessar o Painel Administrativo ("Beno Painel")

1. Abra o seu navegador de internet (Google Chrome, Microsoft Edge ou Safari) no computador ou celular.
2. Acesse o site da escola: `https://escolabenonivio.vercel.app`.
3. Role até o **Rodapé** (final da página) e clique no link **"Área Restrita / Painel Admin"** ou acesse diretamente: `https://escolabenonivio.vercel.app/login`.
4. Digite o e-mail institucional da escola (`benonivio@sed.sc.gov.br`) e a sua senha cadastrada.
5. Clique no botão **"Entrar no Painel"**.

> [!TIP]
> **Dica de Segurança:** Ao encerrar o expediente ou sair do computador, clique sempre no botão **"Sair"** localizado no menu lateral para proteger o painel contra acessos não autorizados.

---

## 💬 2. Gerenciando Turmas e Grupos de WhatsApp

Nesta área você mantém atualizados os nomes das turmas e os links dos grupos de WhatsApp para que pais, responsáveis e alunos entrem no grupo correto.

### Passo a passo:
1. No menu lateral, clique em **"Turmas & WhatsApp"** (`/dashboard/turmas`).
2. Escolha o turno correspondente: **Matutino**, **Vespertino** ou **Noturno**.
3. Localize a turma desejada (ex: *6º Ano 61*, *1º Ano EM 100*) e clique em **"Editar"**.
4. Atualize o nome da turma ou cole o novo link do WhatsApp no campo correspondente (ex: `https://chat.whatsapp.com/...`).
5. Clique em **"Salvar Alterações"**.

---

## 📄 3. Publicação de Documentos Públicos e Prestação de Contas (APP)

Para garantir a transparência da escola (Editais de Eleição, Atas da APP, Prestação de Contas, Regulamentos Internos):

### Passo a passo para publicar:
1. No menu lateral, clique em **"Documentos Públicos"** (`/dashboard/documentos`).
2. Clique no botão **"+ Novo Documento"**.
3. Digite o **Título** (ex: *Ata da Assembleia Ordinária da APP*), escolha a **Categoria** (*Edital*, *Ata*, *Prestação de Contas*, *Regulamento*) e uma breve descrição.
4. Selecione o arquivo no seu computador (PDF, Word ou Excel).
5. Clique em **"Publicar Documento"**.

### 🛡️ Travas Automáticas de Segurança (Protegendo Você e o Site):
Para tranquilizar você durante o uso, o sistema possui "travas inteligentes" que evitam erros acidentais:
- **Limite de Tamanho:** Arquivos de documentos são aceitos até **10 MB** e imagens até **5 MB**. Se um arquivo for maior, o sistema avisa amigavelmente para que você o comprima antes.
- **Proteção contra Vírus:** O sistema só aceita formatos seguros (como PDF, DOCX, XLSX, PNG, JPG).
- **Armazenamento Blindado:** Todos os documentos ficam salvos no bucket seguro `escola_midias` da infraestrutura Supabase, protegidos por criptografia automática.

---

## 📢 4. Publicando Avisos e Comunicados no Mural

Para comunicar suspensão de aulas por chuvas, reuniões de pais ou eventos comunitários:

### Passo a passo:
1. No menu lateral, clique em **"Mural de Avisos"** (`/dashboard/avisos`).
2. Clique em **"+ Criar Aviso"**.
3. Preencha o **Título**, o **Resumo** e o **Conteúdo Completo**.
   - 🔗 **Links e Sites Automáticos:** Qualquer link colado no texto (ex: `https://www.sed.sc.gov.br/...` ou `www.sc.gov.br`) será automaticamente detectado pelo site público e transformado em um link azul clicável que abre em uma nova aba com segurança.
4. **Adicionar Imagens & Banners:**
   - Clique em **"Adicionar Imagem"** para selecionar fotos do seu computador (PNG, JPG, WebP).
   - O painel abrirá por padrão na opção **"Original (Sem Cortes)"**, garantindo que cartazes, flyers, panfletos e informativos verticais ou horizontais sejam salvos 100% íntegros, sem nenhum corte ou zoom que corte cabeçalhos e textos.
   - Se desejar recortar propositalmente em um formato específico (16:9, 4:3, 3:4 ou 1:1), clique na aba **"Recortar / Ajustar"**.
   - No site público (`/avisos`), os comunicados são organizados em formato de grade com altura padronizada e ordenados em sequência cronológica natural (da esquerda para a direita).
5. Se desejar, marque **"Destacar na Página Inicial"** para exibir no carrossel de destaques da Home.
6. Clique em **"Salvar Aviso"**.

---

## 📚 5. Acervo Digital, Podcasts e Revista Okaza

O site público exibe automaticamente:
- **Edições da Revista Okaza:** PDFs completos das edições #1 (2019) e #2 (2020) com relatos de professores da escola.
- **Podcasts do Grupo de Estudos do 3º Ano:** Player integrado do Spotify com os 6 episódios preparatórios para ENEM e vestibulares.
- **Apostilas e Roteiros de Aula:** Gerenciados pelo módulo de acervo pedagógico.

---

## 🔄 6. Protocolo de Sincronização e Atualização do Manual (Docs as Code)

Toda vez que a equipe técnica ou agente de IA realizar uma das seguintes alterações:
1. Criar um novo formulário ou campo na área administrativa;
2. Alterar limites de upload (MB) ou políticas de permissão RLS;
3. Adicionar novas seções ao menu lateral (`/dashboard/*`);

O arquivo `docs/Projeto_Escola_Benonivio/02_Wiki/MANUAL_ADMIN.md` **DEVE SER ATUALIZADO** na mesma alteração de código, mantendo o repositório sincronizado.

---
*Manual mantido em sincronia pela Engenharia de Software do Projeto EEB Professor Benonívio João Martins.*
