# Base de conhecimento — Apps para TV Samsung (Tizen)

Registro do projeto **Kids Player / "Pokémon"** (out/2026): app privado para TV Samsung que mostra um
catálogo curado de vídeos do YouTube, isolado do resto do YouTube, navegável por criança que ainda não lê.

**Status:** funcional e instalado na TV, mas **projeto encerrado**. Motivo: o player embutido do YouTube
toca sempre o áudio original (inglês) e não permite escolher a faixa dublada (pt-BR). Ver
[03-youtube-embed.md](03-youtube-embed.md).

Use esta pasta como ponto de partida para qualquer novo app de TV.

| Arquivo | O que tem |
|---|---|
| [01-arquitetura.md](01-arquitetura.md) | Como o app foi dividido (casca Tizen + página hospedada) e por quê |
| [02-ambiente-tizen.md](02-ambiente-tizen.md) | Developer Mode, VS Code + extensão Tizen, certificado Samsung, `sdb`, instalar/abrir na TV |
| [03-youtube-embed.md](03-youtube-embed.md) | Regras e limites do player do YouTube embutido (o que funciona e o que não dá) |
| [04-controle-remoto-e-ui.md](04-controle-remoto-e-ui.md) | Teclas do controle, foco, navegação em grade, restrições do motor web antigo |
| [05-catalogo-yt-dlp.md](05-catalogo-yt-dlp.md) | Como extrair playlists, títulos em pt-BR e validar vídeos (script em `tools/`) |
| [06-problemas-e-solucoes.md](06-problemas-e-solucoes.md) | Tudo que deu errado e como foi resolvido |
| [07-checklist-novo-app.md](07-checklist-novo-app.md) | Roteiro rápido para começar o próximo app |

## Resumo em 30 segundos

- TV: Samsung UN43RU7100 (2019), **Tizen 5.0**, motor web baseado em Chromium antigo → escrever **JS ES5**.
- App = **casca Tizen mínima** (só um iframe + repasse de teclas) + **app real hospedado no GitHub Pages**.
  Mudanças no app chegam à TV com `git push`; só nome/ícone/permissões exigem novo Build + reinstalação.
- Build e assinatura: **VS Code + extensão "Tizen Extension"** (`tizen.vscode-tizen-csharp`). Não precisou Tizen Studio nem Java.
- Instalar/abrir na TV: `sdb` pela linha de comando (comandos em 02).
- YouTube embutido: funciona bem, dá para esconder toda a interface do YouTube, **mas não escolhe idioma do áudio**.

> Repositório público: não registrar aqui DUID, número de série, IPs, e-mails nem senhas.
> Certificados ficam em `~/SamsungCertificate/` (fora do repositório).
