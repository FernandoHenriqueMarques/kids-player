# 04 — Controle remoto, foco e interface

## Motor web do Tizen 5.0

- Chromium antigo (~63). **Escrever ES5**: `var`, `function`, sem arrow, sem `const/let` por segurança,
  sem `?.`/`??`, sem `fetch` (usar `XMLHttpRequest`), sem `loading="lazy"`.
- CSS: flexbox, `object-fit`, `transform`, `vw/vh` funcionam. Evitar recursos novos (`gap` em flex, `:has`, `aspect-ratio`).
- Viewport da casca: `<meta name="viewport" content="width=1920">`. Na página hospedada, medidas em `vw`
  escalam igual na TV e no navegador do Mac (bom para testar).

## Teclas (keyCode) do controle Samsung

| Tecla | keyCode | Registro |
|---|---|---|
| Enter/OK | 13 | padrão |
| ← ↑ → ↓ | 37 38 39 40 | padrão |
| Voltar | 10009 | padrão |
| Play/Pause | 10252 | `MediaPlayPause` |
| Play | 415 | `MediaPlay` |
| Pause | 19 | `MediaPause` |
| Stop | 413 | `MediaStop` |
| Retroceder | 412 | `MediaRewind` |
| Avançar | 417 | `MediaFastForward` |

Teclas de mídia precisam ser registradas (e a permissão `tv.inputdevice` no `config.xml`):
```js
tizen.tvinputdevice.registerKeyBatch(['MediaPlayPause','MediaPlay','MediaPause','MediaStop','MediaRewind','MediaFastForward']);
```
Sair do app: `tizen.application.getCurrentApplication().exit();` (embrulhar em `try/catch` para rodar fora da TV).
No `config.xml`: `hwkey-event="enable"`.

## Navegação em grade (lição do bug das "Ilhas Laranja")

- Grade com quebras (cabeçalho de temporada) quebra navegação por índice ±N. Usar **navegação geométrica**:
  para ↑/↓, achar a linha imediatamente acima/abaixo pela posição Y e, nela, o card de X mais próximo.
- **Calcular posições relativas ao contêiner rolável somando `offsetTop` até ele** (subindo por
  `offsetParent`). O bug: somar `card.offsetTop + grid.offsetTop` contava a grade duas vezes porque o
  `offsetParent` do card já era o contêiner → a rolagem ia para o lugar errado e o foco "sumia" depois do
  ep. 78. Testar sempre a passagem entre seções.
- Rolagem por `transform: translateY()` no contêiner (mais leve que `scrollTop` na TV), mantendo o card
  focado no terço superior.

## UI para criança que não lê

- Capas grandes (thumbnail do próprio episódio) + **número enorme** em badge amarelo.
- Foco muito visível: borda amarela grossa + `scale(1.08)`.
- ✓ verde em episódios já vistos; ao terminar, foco vai para o próximo número.
- Nada de texto essencial; títulos pequenos são para o adulto.
- Ícone do app: **512×423 px PNG**. Logos/personagens de marcas não foram usados; ícone original (raio).

## Testar sem a TV

A página hospedada aceita teclado do computador (setas, Enter, Espaço, Esc/Backspace = Voltar), então
dá para testar no navegador. No navegador embutido do Claude: emular viewport 1280×720 e disparar
`KeyboardEvent('keydown',{keyCode})` via JS.
