---
tipo: raw_source
fonte: https://sites.google.com/site/escolabenonivio/grupo-de-estudos-do-3-ano
data_captura: 2026-05-27
status: unprocessed
tags: [escola, projetos, enem, vestibular, podcast, pandemia]
---

# Grupo de estudos do 3º ano

## Objetivo
Promover um espaço de diálogo e formação para estudantes concluintes do Ensino Médio, com vistas à realização de provas como ENEM e outros vestibulares (Contexto Pandemia 2020/2021). Encontros quinzenais aos sábados.

## Ferramentas e Anexos
- **Guia de Estudos:** "GUIA DE ESTUDOS PREPARATÓRIOS PARA ENEM E VESTIBULARES" (Link legado).
- **Podcast (Spotify):** Grupo de Estudos do 3º ano do Benonívio (Prof. Vanessa e Djeison). [https://open.spotify.com/show/7zqRN8F3AWrBbcSWh0klNa?si=6b15c586730146f1]

## Cronograma de Encontros (Podcasts Gravados)
1. **22/08/2020:** ENEM e vestibulares, universidade pública x privada. (Profs. Iara Silva e Mariana Suyan):
   <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/episode/0FPrOxnMIJQEij1AmJKgSf?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
2. **05/09/2020:** Bacharelado x licenciatura, cursos de linguagens. (Profs. Carlos Rodrigo e Mirian Carla Barbosa):
   <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/episode/1Dx6AEhMUW0Nor5s9R7Muk?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
3. **19/09/2020:** Grades curriculares, flexibilização, cursos de humanas. (Profs. Katíscia Pereira e Mara Regina Oliveira):
   <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/episode/5HXJHFtOw29zZbBErHeZN2?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
4. **03/10/2020:** Transferências, retornos, cursos de Geografia e Matemática.:
   <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/episode/6bMuK4SqxEm333BTl7yniX?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
5. **17/10/2020:** Cursos técnicos e tecnólogos, Ciências da Natureza.:
   <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/episode/0ziMqtaqgXoMTTPTqQ7dBL?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
6. **31/10/2020:** Profissões do futuro, mercado de trabalho, roteiros de estudos.:
   <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/episode/31d62h0e4HSm9kYslOPOWs?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

---
### Solução Prática: Componente React para o Podcast (Antecipação)

Para incorporar os podcasts quando chegarmos na fase de codificação do `/acervo`, você não precisará manipular áudio. O Antigravity receberá a instrução de usar este _iframe_ otimizado. Salve isso como referência:

TypeScript

```
// Componente de Embed do Spotify no Next.js (Exemplo)
export default function SpotifyEmbed() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg">
      <iframe
        src="https://open.spotify.com/embed/show/COLOQUE_O_ID_DO_PODCAST_AQUI?utm_source=generator&theme=0"
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Podcast Grupo de Estudos"
      />
    </div>
  );
}
```