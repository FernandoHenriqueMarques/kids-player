# Instruções para o Claude

Este repositório é um app para TV Samsung (Tizen 5.0) já concluído/encerrado. Antes de qualquer trabalho
em app de TV (este ou um novo), leia `knowledge/README.md` e os arquivos que ele indica.

Regras rápidas:
- JS que roda na TV: ES5 (Chromium ~63). Sem fetch/arrow/const/let/?./??.
- Lógica do app fica em `docs/` (GitHub Pages); a casca `KidsPlayer/` só muda para nome, ícone, permissões ou URL.
- Build/assinatura: só pela extensão Tizen do VS Code (o usuário clica em Build). Instalar/abrir na TV: `sdb` (ver knowledge/02).
- Repositório público: nunca versionar DUID, número de série, IPs, e-mails, senhas ou `~/SamsungCertificate/`.
- Player do YouTube embutido não escolhe faixa de áudio (dublagem). Ver knowledge/03 antes de prometer idioma.
