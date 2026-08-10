O plano gratuito do [Supabase](https://supabase.com/pricing) vai estourar em aproximadamente 1 ano e 4 meses, e o principal gargalo será o limite de File Storage (armazenamento de arquivos/imagens), e não o banco de dados. [1]

Para calcular o tempo exato com base no cenário de um portal escolar, precisamos separar o projeto em duas partes: as imagens (arquivos) e os posts (texto do banco de dados). [2]

---

## 1. Limite de Imagens (File Storage) — 🚨 O Gargalo Principal

- Cota Gratuita: 1 GB (1.000 MB).
- Consumo estimado: Se cada post contiver, em média, 2 imagens de celulares modernos otimizadas para web (cerca de 1 MB por post no total).
- Frequência: 1 post por dia = 30 MB por mês. [2]

$$1000 \text{ MB} \div 30 \text{ MB/mês} = 33,3 \text{ meses}$$

Se as imagens forem um pouco mais pesadas ou se a comunidade postar fotos de eventos escolares com alta resolução (cerca de 2,5 MB por post):

$$1000 \text{ MB} \div 75 \text{ MB/mês} = 13,3 \text{ meses}$$

> 📉 Resultado: A cota de mídia vai estourar entre 1 ano e 1 mês (imagens pesadas) e 2 anos e 9 meses (imagens bem compactadas).

---

## 2. Limite de Posts (Database Storage) — Dura muitas décadas

- Cota Gratuita: 500 MB de banco de dados.
- Consumo estimado: Um post de texto longo com título, autor, data e comentários consome cerca de 5 KB de dados puramente textuais no Postgres.
- Frequência: 1 post por dia = 150 KB por mês. [2]

$$500.000 \text{ KB} \div 150 \text{ KB/mês} = 3.333 \text{ meses}$$

> 🏛️ Resultado: Apenas armazenando os textos e referências dos posts, o banco de dados gratuito duraria mais de 200 anos.

---

## 3. Outro risco oculto: O Tráfego (Egress)

O plano gratuito inclui 5 GB de transferência de dados (Bandwidth/Egress) por mês.  
Se o portal da escola se tornar muito popular e muitos pais/alunos entrarem ao mesmo tempo para ver as fotos dos posts, o download repetido dessas imagens gastará os 5 GB mensais rapidamente, bloqueando o site antes mesmo do limite de 1 GB de armazenamento estourar. [2]

---

## 💡 Como fazer o plano gratuito durar 5x mais?

Se você aplicar duas estratégias simples, esse mesmo portal pode rodar de graça por vários anos:

- Não salve as imagens originais diretamente: Force o portal a passar as fotos por uma compactação automática antes de enviar ao [Supabase Storage](https://supabase.com/docs/guides/storage/uploads/file-limits), reduzindo cada imagem para menos de 150 KB.
- Utilize uma CDN externa (como Cloudflare): Ative a Cloudflare na frente do seu site de forma gratuita. Ela fará o "cache" das imagens do portal. Assim, quando 100 pais acessarem o mesmo post, o Supabase gastará banda para entregar a imagem apenas 1 vez, e não 100 vezes, protegendo o limite de 5 GB de tráfego.