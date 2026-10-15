# 07 — Checklist para um novo app de TV

## Antes de codar
- [ ] O conteúdo precisa de algo que o embed do YouTube não faz (idioma do áudio, conteúdo com login)? Ver 03.
- [ ] A TV ainda está em Developer Mode com o IP atual do Mac? (`nc -z -G 3 <IP_TV> 26101`)
- [ ] Certificado "Kids" válido (até 15/10/2027) e senhas à mão? Mesmo certificado serve para vários apps na mesma TV.

## Página hospedada (o app de verdade)
- [ ] Copiar `docs/index.html` como base (catálogo + player + teclas + estado salvo).
- [ ] Gerar `episodes.json` com `tools/gerar_catalogo.py` (ou escrever à mão).
- [ ] JS em **ES5**, medidas em `vw`.
- [ ] Testar no navegador do Mac com teclado (setas, Enter, Esc), incluindo passagem entre seções.
- [ ] Publicar (GitHub Pages, pasta `docs/`), ou repositório novo com Pages ativado em `main /docs`.

## Casca Tizen
- [ ] VS Code → Tizen → **Create Project** (web, TV, Basic_Empty).
- [ ] Copiar `KidsPlayer/index.html` e `KidsPlayer/js/main.js`; trocar `APP_URL`.
- [ ] `config.xml`: nome, `required_version="2.3"`, permissões `internet` + `tv.inputdevice`, `<access origin="*" …/>`,
      `context-menu="disable"`, `hwkey-event="enable"`. **Manter o `tizen:application id` gerado** (cada app tem o seu).
- [ ] `icon.png` **512×423 px PNG**.
- [ ] Listar todos os arquivos em `tizen_web_project.yaml → files:`.
- [ ] **Tizen: Build Project** → `Debug/<Nome>.wgt`.
- [ ] Instalar e abrir com `sdb` (comandos em 02).

## Depois
- [ ] Mudanças de conteúdo/visual: só `git push`.
- [ ] Mudanças de nome, ícone, permissões ou `APP_URL`: novo Build + reinstalar.
