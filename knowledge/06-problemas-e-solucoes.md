# 06 — Problemas encontrados e soluções

| Problema | Causa | Solução |
|---|---|---|
| Não conseguia digitar 12345 no painel Apps | Controle Smart sem teclado numérico | Botão **123** (teclado na tela), controle do SmartThings ou controle comum |
| "Player não carregou" na TV | TV não alcança a página / URL errada | Página no GitHub Pages; aviso aparece após 20 s na casca |
| Erro 153 no player | Embed sem Referer (app `file://`) | Hospedar a página que embute o YouTube |
| Extensão "Tizen TV" não instala ("not found") | Despublicada no Marketplace | Usar só `tizen.vscode-tizen-csharp` + pacote "10.0 TV" |
| Extension SDK vazio / "already exists" | Registro por URL não baixou nada | Baixar o zip do certificado e adicionar como **arquivo local** |
| DUID não preenchido no certificado | — | `sdb shell 0 getduid` e adicionar manualmente |
| Ícone Tizen sumiu do VS Code em outra janela | Extensão não ativada naquela janela | Paleta de comandos ou *Developer: Reload Window* |
| Build não incluía arquivos novos | `tizen_web_project.yaml` lista arquivos explicitamente | Atualizar a seção `files:` |
| `sdb devices` vazio | TV entrou em espera / conexão caiu | Ligar a TV e `sdb connect <IP_TV>` |
| `was_kill` falha | Bloqueado em TV de produção | Fechar e reabrir o app manualmente |
| Foco "sumia" após ep. 78 | Posição Y somava a grade duas vezes | Somar `offsetTop` subindo `offsetParent` até o contêiner (ver 04) |
| Áudio sempre em inglês | Limitação do embed do YouTube | Sem solução no embed (ver 03) — motivo de encerrar o projeto |
| `git push` mostra "Load key … id_rsa: Is a directory" | `~/.ssh/id_rsa` é uma pasta | Aviso inofensivo; o push funciona por outra chave/credencial |

## Tempo gasto por etapa (referência)

Hello World na TV ≈ 2 h (a maior parte: Developer Mode + certificado). Catálogo completo ≈ 1 h.
Com esta base, o próximo app deve chegar à TV em ~30 min.
