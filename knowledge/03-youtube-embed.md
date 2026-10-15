# 03 — YouTube embutido (IFrame Player API) na TV

## O que funciona

- **IFrame Player API** (`https://www.youtube.com/iframe_api`) rodando no motor web do Tizen 5.0. Vídeo em HD, sem travar.
- Host `https://www.youtube-nocookie.com` (sem cookies/conta).
- `playerVars` usados para "esconder" o YouTube:
  `autoplay:1, controls:0, rel:0, fs:0, disablekb:1, iv_load_policy:3, playsinline:1, origin: location.origin`.
- **Isolamento total** obtido com três camadas:
  1. Uma `div` transparente por cima do player bloqueia qualquer clique/ponteiro (logo, título, links).
  2. Tela própria cobre o player **ao pausar** (o YouTube mostraria "mais vídeos").
  3. Em `ENDED`, o app fecha o player e volta ao catálogo **antes** da tela final do YouTube com sugestões.
- Thumbnails: `https://i.ytimg.com/vi/<ID>/mqdefault.jpg` (16:9, leve).
- Checar se um vídeo permite embed: `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=<ID>`
  (200 = ok; 401 = embed proibido; 404 = removido/privado).

## O que NÃO funciona (verificado)

| Tentativa | Resultado |
|---|---|
| Abrir o embed direto do app empacotado (`file://`) | **Erro 153** — o YouTube exige Referer/origem. Solução: página hospedada em HTTPS |
| Escolher o **áudio dublado** (pt-BR) em vídeo com várias faixas | **Impossível.** O embed toca sempre o áudio original |
| `playerVars: { hl:'pt-BR', persist_hl:1 }` | Muda só a interface; áudio e título continuam no original |
| Navegador em pt-BR + host `www.youtube.com` + **logado** no YouTube (Chrome do Mac) | Áudio continua em inglês |
| `player.getOptions()` | Só expõe o módulo `captions` (legendas). Não existe API de faixa de áudio |
| `getVideoData()` | Título original e `isMultiChannelAudio:false` mesmo com dublagens disponíveis |

**Conclusão:** para conteúdo com dublagem em faixa extra (ex.: canal oficial Pokémon TV), um app próprio
com embed do YouTube só entrega o idioma original. A dublagem só aparece no app/site oficial do YouTube.
Alternativa avaliada: app oficial do YouTube na TV com **perfil infantil supervisionado** no modo
"Aprovar o conteúdo você mesmo" (configurado pelo app YouTube Kids no celular).
Baixar os vídeos para servir localmente foi descartado (viola os termos do YouTube).

## Códigos de erro do player (`onError`)

`2` ID inválido · `5` erro HTML5 · `100` removido/privado · `101`/`150` embed proibido pelo dono · `153` falta Referer.

## Autoplay

Na TV o autoplay com som funcionou. Mesmo assim o app mostra uma tela "▶" se o vídeo não começar em
~4 s, para não ficar tela preta.
