# Rule: Docs as Code & Centralização de Contexto

## Fonte de Verdade
Todas as sessões deste repositório DEVEM adotar rigorosamente a arquitetura **Docs as Code**.
O arquivo principal de estado é:
`docs/Projeto_Escola_Benonivio/04_Logs/CONTEXTO_ATUAL.md`

## Diretrizes Obrigatórias para Qualquer Agente
1. **Atualização Contínua de Estado:** Toda alteração significativa de arquitetura, adição/remoção de componentes, refatoração de código ou alteração de banco de dados DEVE ser registrada imediatamente em `docs/Projeto_Escola_Benonivio/04_Logs/CONTEXTO_ATUAL.md`.
2. **Organização por Módulos:**
   - `00_Schema/`: Regras de arquitetura, padrões de código, diagramas de banco de dados.
   - `01_Raw_Sources/`: Dados brutos, levantamentos históricos e censitários.
   - `02_Wiki/`: Manuais didáticos (ex: `MANUAL_ADMIN.md`), guias de operação.
   - `03_Projetos/`: Especificações de novos módulos, PRDs.
   - `04_Logs/`: Registro de estado atual (`CONTEXTO_ATUAL.md`), relatórios de auditoria e logs de alterações.
3. **Início de Sessão:** Sempre consulte `docs/Projeto_Escola_Benonivio/04_Logs/CONTEXTO_ATUAL.md` no início da interação para recuperar o contexto atual do projeto sem perdas de histórico.
