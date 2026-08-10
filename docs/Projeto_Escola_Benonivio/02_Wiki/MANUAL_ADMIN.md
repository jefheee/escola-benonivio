# 📖 Manual do Administrador - EEB Professor Benonívio João Martins

Este guia foi elaborado especialmente para a **Direção, Secretaria e Equipe Pedagógica** da Escola de Educação Básica Professor Benonívio João Martins. Seu objetivo é ensinar, passo a passo e de forma simples, como gerenciar todas as informações do portal da escola.

---

## 📌 1. Como Acessar o Painel Administrativo

1. Abra o navegador (Google Chrome, Microsoft Edge ou Safari) e acesse o site da escola: `https://escolabenonivio.vercel.app`.
2. Vá até o **Rodapé** (final da página) e clique no link **"Área Restrita / Painel Admin"** ou acesse diretamente: `https://escolabenonivio.vercel.app/login`.
3. Digite o e-mail institucional da escola (`benonivio@sed.sc.gov.br`) e a sua senha cadastrada.
4. Clique no botão **"Entrar no Painel"**.

> [!TIP]
> **Dica de Segurança:** Ao terminar de usar o sistema, lembre-se sempre de clicar em **"Sair"** no menu lateral para encerrar sua sessão com segurança.

---

## 💬 2. Gerenciando Turmas e Grupos de WhatsApp

Nesta seção, você pode atualizar os links dos grupos de WhatsApp de cada turma para que pais, alunos e responsáveis entrem no canal de comunicação correto.

### Passo a passo para atualizar uma turma:
1. No menu lateral do Painel, clique em **"Turmas & WhatsApp"** (`/dashboard/turmas`).
2. Escolha a aba correspondente ao turno desejado: **Matutino**, **Vespertino** ou **Noturno**.
3. Localize a turma desejada (ex: *1º Ano 01*, *3º Ano EM 01*) e clique no botão **"Editar"**.
4. Cole o novo link do grupo do WhatsApp no campo indicado (ex: `https://chat.whatsapp.com/...`).
5. Clique em **"Salvar Alterações"**.

> [!NOTE]
> O link é atualizado imediatamente no site público na página **"Nossas Turmas"**, permitindo que a comunidade escolar acesse com apenas 1 clique.

---

## 📄 3. Publicação de Documentos Públicos e Transparência

A legislação e a governança escolar exigem transparência em Editais, Prestação de Contas da APP (Associação de Pais e Professores) e Regulamentos Internos.

### Passo a passo para publicar um documento:
1. No menu lateral do Painel, clique em **"Documentos Públicos"** (`/dashboard/documentos`).
2. Clique no botão azul **"+ Novo Documento"**.
3. Preencha o **Título** (ex: *Edital de Eleição da APP 2026*), selecione a **Categoria** (*Edital*, *Ata*, *Prestação de Contas*, *Regulamento*) e adicione uma breve descrição.
4. Clique na área de **Upload** e selecione o arquivo do seu computador (PDF, Word ou Excel).
5. Clique em **"Publicar Documento"**.

### 🛡️ Travas Automáticas de Segurança (Proteção para Você):
Para evitar problemas no site e garantir que a página continue rápida e segura para os pais:
- **Tamanho Máximo de Arquivos:** O sistema limita automaticamente documentos a **10MB** e imagens a **5MB**. Se você tentar enviar um arquivo maior, o sistema exibirá um aviso educativo.
- **Validação de Formatos:** Apenas formatos seguros (como PDF, DOCX, XLSX, PNG, JPG) são aceitos. Isso evita a publicação acidental de vírus ou arquivos corrompidos.
- **Armazenamento Blindado:** Todos os documentos ficam salvos no bucket seguro `escola_midias` da infraestrutura Supabase, protegidos por políticas automáticas de acesso (RLS).

---

## 📢 4. Publicando Avisos e Comunicados no Mural

O **Mural de Avisos** (`/avisos`) serve para informar a comunidade escolar sobre reuniões de pais, feriados, suspensão de aulas, prazos de matrícula ou eventos comunitários.

### Passo a passo para criar um aviso:
1. No menu lateral do Painel, clique em **"Mural de Avisos"** (`/dashboard/avisos`).
2. Clique em **"+ Criar Aviso"**.
3. Preencha o **Título** e o **Texto do Comunicado**.
4. Defina a **Prioridade**:
   - 🟢 **Informativo / Geral:** Para avisos rotineiros (reuniões, feira cultural).
   - 🟡 **Importante:** Para lembretes com prazos próximos (rematrículas).
   - 🔴 **Urgente / Alerta:** Para avisos imediatos (ex: suspensão de aula por chuva).
5. Se desejar, marque a opção **"Fixar no topo"** para que a notícia apareça em destaque na página inicial.
6. Clique em **"Publicar Aviso"**.

---

## 📚 5. Acervo Digital e Projetos Pedagógicos

No módulo **"Acervo Digital"** (`/dashboard/acervo`), você pode cadastrar e organizar:
- **Fotos de Feiras de Ciências e Eventos:** Registro histórico da escola.
- **Projetos Pedagógicos:** Documentação de grupos de estudo, projetos de incentivo à leitura e iniciativas comunitárias.
- **Publicações e Revistas:** Links e mídias das publicações escolares.

---

## ❓ Perguntas Frequentes (FAQ)

* **O que fazer se o arquivo for maior que o limite permitido?**  
  Caso seu arquivo PDF tenha mais de 10MB, você pode usar ferramentas gratuitas online (como *ILovePDF* ou *Smallpdf*) para "Comprimir PDF" antes de fazer o envio.

* **Como excluir um documento ou aviso antigo?**  
  No painel correspondente, basta clicar no ícone da **Lixeira (Excluir)** ao lado do item desejado e confirmar. O item será removido do site instantaneamente.

* **Esqueci minha senha de acesso, o que fazer?**  
  Entre em contato com o suporte técnico da administração do sistema para solicitar a redefinição de credenciais de forma segura.

---
*Manual elaborado pela Engenharia de Software do Projeto EEB Professor Benonívio João Martins.*
