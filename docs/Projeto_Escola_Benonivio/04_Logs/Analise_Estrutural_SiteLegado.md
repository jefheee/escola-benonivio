---
data: 2026-05-27
ticket: Discovery-Fase1
status: Em Andamento
---

# 🧠 Análise do Site Google Sites (Legado)

## Diagnóstico Visual e Funcional
- **PPP (Projeto Político Pedagógico):** O link do Google Drive está quebrado. 
  - *Ação Necessária:* Solicitar o PDF atualizado à direção ou à APP para hospedar estaticamente no novo projeto.
- **Conselho Deliberativo / Calendário / Horários:** Estão congelados entre 2020 e 2021. 
  - *Decisão Arquitetural:* O novo site não deve ter essas abas fixas se depender de inserção manual. Redirecionar essas informações para o feed dinâmico (Instagram API) ou focar em informações atemporais.
- **MCC (Mostra Científica e Cultural):** Print indica última atualização em 2019.

## Próximos Passos
Aguardando o recebimento da segunda parte do conteúdo extraído do site antigo para finalizar a etapa de Ingestão de Dados (`01_Raw_Sources`).

---
## Diagnóstico Adicional (Fase 2)
- **Páginas Mortas:** Grêmio Estudantil e Grupo COM-VIDA estão com *placeholders* de construção. Descartar da navegação principal do novo site.
- **Calendário e Horários:** Congelados em 2020/2021. Não migrar como páginas estáticas. Requer solução dinâmica ou exclusão.
- **MCC (Mostra Científica e Cultural):** Último registro em 2019 (95 trabalhos, 1200 estudantes).
- **Decisão de Roteamento:** Criar rota `/acervo` para abrigar "Grupo Butterfly" e "Grupo de Estudos 3º Ano". Estes conteúdos serão Server Components puros, gerados no *build*.

---
## Fechamento da Ingestão (Discovery Finalizado)
- O mapeamento do site antigo está 100% concluído no Obsidian.
- **Dívida Técnica Sanada:** O problema de hospedagem de imagens antigas foi resolvido nativamente, mapeando os links diretos do Google Photos. A Vercel não sofrerá impacto de banda.
- **Status:** Repositório pronto para iniciar a geração do *Boilerplate* em Next.js.