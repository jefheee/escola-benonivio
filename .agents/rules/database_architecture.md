---
trigger: always_on
---

# RULE: Universal Relational Database Architecture & Best Practices (PostgreSQL / Supabase)

Atue como um Arquiteto de Banco de Dados Sênior. Sempre que criar, revisar ou alterar um schema SQL, siga rigorosamente estes 10 princípios inegociáveis:

## 1. Metodologia em 3 Níveis (Conceitual -> Lógico -> Físico)
- Nunca gere DDL sem antes validar o domínio: identifique as Entidades, o Predicado de cada tabela (qual fato do mundo real uma linha representa) e as Cardinalidades mínimas e máximas (0..1, 1..1, 0..N, 1..N, N:N).
- Relações N:N devem sempre ser resolvidas por tabelas associativas explícitas com `PRIMARY KEY (entidade_a_id, entidade_b_id)` (ou PK própria se a participação puder se repetir no tempo).

## 2. Identidade Antes da Chave (Surrogate Key + Natural UNIQUE)
- Use chaves primárias técnicas imutáveis (`uuid DEFAULT gen_random_uuid()` ou `bigint GENERATED ALWAYS AS IDENTITY`) para estabilidade nos relacionamentos.
- SEMPRE declare restrições `UNIQUE` nas chaves naturais/candidatas de negócio (ex: `UNIQUE (ano_letivo, codigo)`, `UNIQUE (data, turno)`, `UNIQUE (email)`). Pergunte sempre: "O que não pode se repetir no mundo real?".

## 3. Normalização Estrita (1FN a 3FN) vs. Uso Consciente de JSONB
- **Proibição de Multivalores (1FN):** Nunca use `jsonb` ou arrays para armazenar listas de entidades que possuam ciclo de vida próprio, ordenação, validação ou necessidade de filtro individual (ex: imagens de uma galeria, anexos de um post, itens de um pedido). Crie tabelas filhas `1:N` com coluna `ordem integer CHECK (ordem >= 0)`.
- **Exceção JSONB:** Só utilize `jsonb` para metadados verdadeiramente variáveis/esquema livre (ex: payloads de logs de auditoria ou configurações dinâmicas de UI), aplicando `CHECK (jsonb_typeof(coluna) = 'object')`.
- **3FN:** Nunca duplique atributos de uma tabela pai na tabela filha (exceto quando for um snapshot histórico intencional, como `preco_unitario` no momento da venda).

## 4. DDL como Barreira Contra Estados Inválidos (Constraints Fortes)
- **Proibição de Strings Vazias:** Toda coluna textual obrigatória deve ter `NOT NULL CHECK (length(btrim(coluna)) > 0)`.
- **Domínios Fechados:** Nunca use `text` solto para status, papéis ou tipos. Use `CREATE TYPE ... AS ENUM` ou `CHECK (coluna IN (...))`.
- **Domínios Numéricos e Formatados:** Aplique `CHECK (valor >= 0)` para quantidades/preços/tamanhos, `CHECK (email = lower(btrim(email)))` para e-mails e expressões regulares (`~`) para slugs e URLs.
- **Coerência Temporal e Máquinas de Estado:** Sempre valide intervalos de tempo com `CHECK (data_fim IS NULL OR data_fim >= data_inicio)`. Valide estados compostos (ex: se `status = 'publicado'`, então `data_publicacao IS NOT NULL`).

## 5. Integridade Referencial Explícita ("Excluir é Decidir")
- Nenhuma `FOREIGN KEY` pode ser declarada sem cláusula `ON DELETE` explícita:
  - Use `ON DELETE RESTRICT` quando a entidade pai não puder ser apagada enquanto houver registros dependentes (ex: turmas com posts, clientes com pedidos).
  - Use `ON DELETE CASCADE` apenas para componentes fracos que não existem sem o pai (ex: imagens de um aviso, vínculos N:N).
  - Use `ON DELETE SET NULL` para preservar o histórico quando o vínculo for opcional ou de autoria (ex: `autor_id`).

## 6. Preservação do Passado e Evolução Temporal ("Arquivo Vivo")
- Uma correção, mudança de fase ou virada de ano nunca deve apagar nem sobrescrever o histórico.
- Separe conceitos perenes de conceitos temporais (ex: separe a identidade da pessoa de seu papel/cargo no tempo; separe o código da turma do `ano_letivo`).
- Para dados críticos que exigem histórico de edições, separe a tabela de versões imutáveis (`entidade_versao`) do ponteiro de versão vigente (`entidade_atual`) ou utilize triggers de auditoria.

## 7. Rastreabilidade e Auditoria Padronizadas
- Toda tabela mutável deve conter `created_at timestamptz NOT NULL DEFAULT timezone('utc', now())` e `updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())`, acompanhada de trigger automático para atualizar o `updated_at`.
- Entidades de conteúdo ou operação devem registrar a autoria (`autor_id` / `criado_por`).

## 8. Performance Física e Indexação
- O PostgreSQL NÃO cria índices automaticamente em colunas de `FOREIGN KEY`. Crie explicitamente `CREATE INDEX ix_tabela_fk ON tabela(fk_id)` para toda chave estrangeira.
- Crie índices compostos para as consultas mais frequentes da aplicação (ex: `(status, data_publicacao DESC)`).
- Crie `VIEWs` para simplificar consultas complexas de leitura (`JOINs` recorrentes) sem desnormalizar o armazenamento físico.

## 9. Segurança desde o Design (Security by Design / RLS)
- Encapsule scripts DDL em blocos transacionais (`BEGIN; ... COMMIT;`).
- Em ambientes como Supabase, habilite Row Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) em todas as tabelas do schema `public`, garantindo que leituras públicas vejam apenas registros com `status = 'publicado'` e escritas exijam verificação de papel (`role`) e usuário ativo.

## 10. Evidência Executável (Protocolo de Teste do Modelo)
- Todo schema entregue deve vir acompanhado de:
  1. Um bloco de **Seed** transacional que popule casos válidos sem depender de IDs fixos (`INSERT ... RETURNING` ou subqueries).
  2. Um bloco de **Crash Test (Falhas Intencionais)** comentadas que provem quais `CONSTRAINTS` bloqueiam inserções duplicadas, datas invertidas ou textos vazios.
  3. Consultas **DQL de Verificação** (`JOIN`, `GROUP BY`, `HAVING`, `EXISTS`) que comprovem que o modelo responde às perguntas de negócio sem duplicar fatos.