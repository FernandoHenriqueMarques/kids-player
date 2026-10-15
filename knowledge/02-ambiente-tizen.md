# 02 — Ambiente Tizen (TV Samsung) no macOS

Testado em out/2026, Mac Apple Silicon, TV UN43RU7100 (2019, Tizen 5.0, armv7).

## 1. Developer Mode na TV

1. Abrir **Apps** (painel de apps) e digitar **12345**.
   - O controle "Smart" dessa TV não tem números: usar o botão **123** (teclado na tela),
     o controle do app **SmartThings** no celular, ou um controle comum com números.
   - Nada pode estar selecionado (nem campo de busca) quando digitar.
2. **Developer mode: On** e informar o **IP do Mac**.
3. Reiniciar a TV (tirar da tomada ~10 s é o mais garantido).
4. Conferir do Mac: `nc -z -G 3 <IP_TV> 26101` → porta 26101 aberta = Developer Mode ativo.

O IP da TV fica em *Configurações → Geral → Rede → Status da rede*. Se o roteador trocar o IP da TV
ou do Mac, refazer o passo 2.

## 2. VS Code + extensão Tizen (sem Tizen Studio)

- Instalar a extensão **Tizen Extension** — ID `tizen.vscode-tizen-csharp`
  (`code --install-extension tizen.vscode-tizen-csharp`). Ela baixa e gerencia o SDK sozinha.
- A extensão **"Tizen TV Extension"** (`samsungtvsdk.tv-vscode-tizen`) que aparece na documentação da Samsung
  estava **despublicada** do Marketplace (verificado pela API da loja). Não é necessária.
- SDK fica em `~/.tizen-extension-platform/server/sdktools/data/`.
- No **Package Manager** da extensão:
  - **Advanced SDK Installation → "10.0 TV"** (instala os pacotes TV-SAMSUNG; serve para TVs Tizen 5.0 também).
  - **Extension SDK → Samsung Certificate Extension** — a lista vem vazia. Solução que funcionou:
    1. Baixar o zip oficial (endereço tirado de `https://download.tizen.org/sdk/tizenstudio/official/extension_info.xml`):
       `https://download.tizen.org/sdk/extensions/tizen-certificate-extension_2.0.75.zip` (~42 MB).
    2. **+ Add Extension** → nome qualquer (ex.: "Samsung Cert Local") → **"…" → selecionar o zip local**.
       (Adicionar pela URL criou um registro "fantasma" e nada aparecia.)
    3. **Packages → Refresh → instalar `cert-add-on`**.

## 3. Certificado Samsung

- **Cmd+Shift+P → Tizen: Certificate Manager → Create a new Certificate → Samsung → TV**.
- Perfil usado: **"Kids"**. Arquivos em `~/SamsungCertificate/Kids/` (`author.p12`, `distributor.p12`).
  **Não versionar** essa pasta. Guardar as senhas.
- Pede login numa **conta Samsung** — qualquer conta serve; não precisa ser a da TV.
- **DUID**: não foi preenchido sozinho. Pegar com:
  ```bash
  SDB=~/.tizen-extension-platform/server/sdktools/data/tools/sdb
  $SDB connect <IP_TV> && $SDB -s <IP_TV>:26101 shell 0 getduid
  ```
  (É o mesmo valor de "ID do Dispositivo Único" em *Sobre esta TV*.) Colar em "Add individual DUIDs".
- Validade: 2 anos (expira 15/10/2027). Para outra TV: novo certificado ou incluir o DUID dela.

## 4. Criar projeto, Build

- Barra lateral Tizen (ou Cmd+Shift+P) → **Create Project** → web / 10.0 / TV / **Basic_Empty**.
- A extensão só empacota projetos criados por ela (usa `tizen_web_project.yaml`).
  **Todo arquivo que vai no pacote precisa estar listado em `files:` desse yaml.**
- `config.xml`: manter o `tizen:application id` gerado; `required_version="2.3"` funciona na TV 5.0
  mesmo com projeto 10.0. Permissões usadas: `internet`, `tv.inputdevice`, `application.launch`;
  `<access origin="*" subdomains="true"/>`.
- **Cmd+Shift+P → Tizen: Build Project** → gera `KidsPlayer/Debug/KidsPlayer.wgt` assinado com o perfil ativo.
  O Build só funciona pela extensão (não há CLI `tizen` nem Java instalados).
- Se o ícone Tizen sumir da barra lateral: usar a paleta de comandos, ou *Developer: Reload Window*.

## 5. Instalar e abrir na TV (linha de comando)

```bash
SDB=~/.tizen-extension-platform/server/sdktools/data/tools/sdb
D=<IP_TV>:26101
PKG=73g3PdqERx                       # package id do config.xml
$SDB connect <IP_TV>
$SDB -s $D push KidsPlayer/Debug/KidsPlayer.wgt /home/owner/share/tmp/sdk_tools/tmp/KidsPlayer.wgt
$SDB -s $D shell 0 vd_appinstall $PKG /home/owner/share/tmp/sdk_tools/tmp/KidsPlayer.wgt
$SDB -s $D shell 0 was_execute $PKG.KidsPlayer
```
- `was_kill` **não funciona** em TV de produção ("cannot working in released image"): para recarregar,
  fechar e abrir o app manualmente.
- A conexão `sdb` cai quando a TV entra em espera; reconectar com `sdb connect`.
- Útil: `$SDB -s $D capability` (versão Tizen, arquitetura).
