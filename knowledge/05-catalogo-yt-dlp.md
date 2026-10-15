# 05 — Montar o catálogo a partir de uma playlist

Ferramenta: **yt-dlp** (`brew install yt-dlp`). Só lê metadados (`--flat-playlist`), não baixa vídeo.

## Listar a playlist (separador TAB — títulos contêm "|")

```bash
yt-dlp --flat-playlist \
  --print "%(playlist_index)s	%(id)s	%(title)s" \
  "https://www.youtube.com/playlist?list=<LIST_ID>" > playlist.tsv
```

## Títulos em português (traduções do próprio canal)

```bash
yt-dlp --flat-playlist --print "%(playlist_index)s	%(id)s	%(title)s" \
  --add-headers "Accept-Language:pt-BR" --extractor-args "youtube:lang=pt" \
  -I 1:112 "https://www.youtube.com/playlist?list=<LIST_ID>"
```
(`-I` seleciona itens, ex.: `1:3,77:80,112`.)

## Ver faixas de áudio de um vídeo

```bash
yt-dlp -F "https://www.youtube.com/watch?v=<ID>" | grep "audio only"
```
Mostra `[pt-BR] Portuguese (BR)` quando há dublagem — mas lembrar: o embed **não** usa essas faixas (ver 03).

## Script

`tools/gerar_catalogo.py` faz tudo: lê a playlist (inglês + pt-BR), limpa títulos
("| POKÉMON FULL EPISODE 18 | Season 1", "| EPISÓDIO COMPLETO …"), padroniza aspas/travessões, valida cada
vídeo via oEmbed e grava o JSON. Exemplo (o que gerou este catálogo):

```bash
python3 tools/gerar_catalogo.py "https://www.youtube.com/playlist?list=PL-t1336xq7ylM3MrecDPkMOo6YtMBj2gk" \
  --ate 112 --secao "Liga Índigo:1-78" --secao "Ilhas Laranja:79-112" --titulo "Pokémon" \
  --saida docs/episodes.json
```
Correções manuais (títulos errados no canal) vão depois, direto no JSON.

## Formato de `docs/episodes.json`

```json
{ "title": "Pokémon",
  "source": "https://www.youtube.com/playlist?list=…",
  "episodes": [ { "n": 1, "id": "z3hMX65Khtg", "title": "Pokémon, Eu Escolho Você!",
                  "title_en": "Pokémon, I Choose You!", "season": "Liga Índigo" } ] }
```
A página agrupa por `season` (cada mudança de valor abre uma seção) e mostra `n` no badge.

## Decisões deste catálogo

- Playlist oficial "Pokémon TV": itens **1–112 = 1ª geração** (113 já é Johto, "Don't Touch That 'Dile").
  Seções: **Liga Índigo 1–78**, **Ilhas Laranja 79–112**. O canal numera em "Season 1 (52) / Season 2 (60)",
  diferente da numeração oficial japonesa; usamos a ordem da playlist (1–112, sem lacunas).
- Correções manuais: ep. 55 veio com título repetido do 49 no canal → "Charada"; ep. 53 capitalização.
- Lista fica **fixa no repositório**: o canal oficial pode tirar/trocar vídeos; revalidar de tempos em tempos.
