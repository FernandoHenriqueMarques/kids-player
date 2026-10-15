# Kids Player — Hello World (Samsung UN43RU7100 / Tizen 5.0)

Duas peças:

- `web/player.html` — página **hospedada** que embute o YouTube (precisa de origem HTTP real, senão o YouTube recusa o embed).
- `tizen/` — app da TV. Abre a página acima num iframe e repassa o controle remoto via `postMessage`.

Controle: **OK / Play-Pause** = pausar/tocar · **◀ ▶** = ±10s · **Voltar** = sair.
Ao pausar ou terminar, uma tela própria cobre o player (nada de "mais vídeos" do YouTube).

---

## 1. Testar no Mac (5 min)

```bash
cd kids-player/web
python3 -m http.server 8000
```
Abra `http://localhost:8000/player.html` no navegador. Espaço = pausa, setas = ±10s.

## 2. Hospedar a página

**Opção A — GitHub Pages (recomendado):** crie o repositório `kids-player`, suba `web/player.html` na raiz,
ative *Settings → Pages* (branch `main`). URL: `https://SEU_USUARIO.github.io/kids-player/player.html`.

**Opção B — Mac na rede:** use o servidor do passo 1 e a URL `http://IP_DO_MAC:8000/player.html`
(só funciona com o Mac ligado).

Depois edite `PLAYER_URL` em `tizen/js/main.js`.

## 3. Preparar a TV

1. **Apps** → digite `12345` no controle → **Developer mode: ON** → IP = IP do seu Mac.
2. Reinicie a TV (desligar da tomada é o mais garantido).
3. Anote o IP da TV (*Configurações → Geral → Rede → Status da rede*).

## 4. Tizen Studio no Mac

1. Instale o **Tizen Studio** (com CLI). No *Package Manager*:
   - *Main SDK*: **Tizen SDK tools** (+ Web CLI)
   - *Extension SDK*: **Samsung Certificate Extension** e **TV Extensions-5.0**
2. Conecte a TV:
   ```bash
   export PATH="$HOME/tizen-studio/tools:$HOME/tizen-studio/tools/ide/bin:$PATH"
   sdb connect IP_DA_TV
   sdb devices          # deve listar a TV
   ```
3. *Tools → Certificate Manager → +* → **Samsung** → **TV** → crie perfil (ex. `kids`),
   faça login com a conta Samsung. No certificado de distribuidor, inclua o **DUID** da TV
   (o Certificate Manager pega automaticamente da TV conectada).

## 5. Empacotar e instalar

```bash
cd kids-player/tizen
tizen package -t wgt -s kids -- .
tizen install -n KidsPlayer.wgt -t $(sdb devices | awk 'NR==2{print $3}')
```
O app aparece em **Apps** como *Kids Player*.

Debug: `tizen run -p FrnKidsTv1.KidsPlayer -t <device>` e, para inspecionar,
`sdb shell 0 debug FrnKidsTv1.KidsPlayer` → abre porta para Chrome DevTools.

## Erros comuns

| Sintoma | Causa provável |
|---|---|
| "Player não carregou" | `PLAYER_URL` errada ou TV sem internet |
| Erro 153 | Página aberta sem origem (file://) — precisa estar hospedada |
| Erro 101/150 | Vídeo não permite embed |
| Instalação falha com erro de assinatura | Certificado sem o DUID da TV, ou perfil errado no `-s` |

## Próximo passo

Trocar o `VIDEO_ID` fixo por um catálogo (JSON com seus vídeos/playlists curadas) + tela de seleção
navegável pelo controle — `player.html` já aceita `load` de outro vídeo via `postMessage`.
