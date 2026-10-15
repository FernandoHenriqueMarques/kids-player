# 01 — Arquitetura

```
┌──────────────── TV (app Tizen instalado, assinado) ────────────────┐
│ KidsPlayer/index.html  →  <iframe src="https://<user>.github.io/…"> │
│ KidsPlayer/js/main.js  →  captura teclas do controle e repassa     │
│                           via postMessage para o iframe            │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │ postMessage {target:'kids-app', cmd:'key', arg:'up'|'enter'|…}
                                   ▼
┌──────────── GitHub Pages (pasta docs/ do repositório) ─────────────┐
│ docs/index.html     catálogo + player YouTube na mesma página      │
│ docs/episodes.json  lista curada (n, id, title, title_en, season)  │
└─────────────────────────────────────────────────────────────────────┘
                 responde {source:'kids-app', type:'ready'|'exit'}
```

## Por que dividir assim

1. **Atualizar sem reinstalar.** Instalar na TV exige Build assinado no VS Code + `sdb`. Com a lógica
   hospedada, editar catálogo/visual/comportamento = `git push` (Pages publica em ~1 min). A TV pega a
   versão nova na próxima abertura do app (GitHub Pages usa cache de ~10 min).
2. **O YouTube exige origem HTTP real.** Embed aberto a partir de arquivo local (`file://`, que é o caso
   de um app Tizen empacotado) cai no **erro 153** (falta Referer). A página hospedada resolve.
3. **Teclas ficam com a casca.** O iframe tem `tabindex="-1"` e `pointer-events:none`; o foco fica no
   documento da casca, que recebe o `keydown` do controle e repassa. Assim o YouTube nunca recebe foco.

## Contrato de mensagens

| Direção | Mensagem | Significado |
|---|---|---|
| casca → página | `{target:'kids-app', cmd:'key', arg}` | `arg`: `up down left right enter back playpause play pause stop rew ff` |
| página → casca | `{source:'kids-app', type:'ready'}` | página carregou (casca cancela o aviso de "sem conexão") |
| página → casca | `{source:'kids-app', type:'exit'}` | Voltar no catálogo → casca fecha o app |

Antes de receber `ready`, a casca trata Voltar como "sair" (para não prender a criança numa tela vazia).

## Arquivos do repositório

| Caminho | Papel |
|---|---|
| `KidsPlayer/` | **Projeto Tizen atual** (criado pela extensão do VS Code). `config.xml`, `index.html`, `js/main.js`, `icon.png`, `tizen_web_project.yaml` |
| `docs/` | Site publicado no GitHub Pages (app real + `episodes.json`) |
| `docs/player.html` | Legado: Hello World (um vídeo só). Mantido como referência mínima |
| `tizen/` | Legado: primeira casca, antes de existir o projeto da extensão. Não é usada no build |
| `tools/gerar_catalogo.py` | Gera `docs/episodes.json` a partir de uma playlist |
| `knowledge/` | Esta base |

## Estado salvo

`localStorage` na origem do GitHub Pages (chave `pokemon-kids-v1`): episódios assistidos (✓) e último
episódio focado. Fica na TV; sobrevive a atualizações da página. Sempre em `try/catch`.
