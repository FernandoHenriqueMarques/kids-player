#!/usr/bin/env python3
"""Gera o catálogo (episodes.json) a partir de uma playlist do YouTube.

Requer yt-dlp (brew install yt-dlp). Só lê metadados; não baixa vídeos.

Exemplo:
  python3 tools/gerar_catalogo.py "https://www.youtube.com/playlist?list=PL-t1336xq7ylM3MrecDPkMOo6YtMBj2gk" \
    --ate 112 --secao "Liga Índigo:1-78" --secao "Ilhas Laranja:79-112" --titulo "Pokémon" \
    --saida docs/episodes.json
"""
import argparse
import json
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor


def listar(url, ate, pt=False):
    cmd = ["yt-dlp", "--flat-playlist", "--print", "%(playlist_index)s\t%(id)s\t%(title)s"]
    if ate:
        cmd += ["-I", "1:%d" % ate]
    if pt:
        cmd += ["--add-headers", "Accept-Language:pt-BR", "--extractor-args", "youtube:lang=pt"]
    out = subprocess.run(cmd + [url], capture_output=True, text=True, check=True).stdout
    itens = []
    for linha in out.splitlines():
        partes = linha.split("\t", 2)
        if len(partes) == 3 and partes[0].isdigit():
            itens.append((int(partes[0]), partes[1], partes[2]))
    return itens


SUFIXOS = re.compile(
    r"\s+(?:\||l)\s+(?:POKÉMON\s+)?(?:FULL EPISODE|EPIS[ÓO]DIO COMPLETO).*$", re.IGNORECASE)


def limpar(titulo):
    t = SUFIXOS.sub("", titulo)
    t = t.split(" | ")[0]
    t = t.replace("’", "'").replace("—", " — ")
    return re.sub(r"\s+", " ", t).strip()


def embed_ok(vid):
    url = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(
        "https://www.youtube.com/watch?v=" + vid)
    try:
        urllib.request.urlopen(url, timeout=15).read()
        return True
    except Exception:
        return False


def secao_de(n, secoes):
    for nome, ini, fim in secoes:
        if ini <= n <= fim:
            return nome
    return ""


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("playlist")
    ap.add_argument("--ate", type=int, help="último item da playlist a incluir")
    ap.add_argument("--secao", action="append", default=[], help='"Nome:ini-fim" (pode repetir)')
    ap.add_argument("--titulo", default="Catálogo")
    ap.add_argument("--saida", default="docs/episodes.json")
    a = ap.parse_args()

    secoes = []
    for s in a.secao:
        nome, faixa = s.rsplit(":", 1)
        ini, fim = faixa.split("-")
        secoes.append((nome, int(ini), int(fim)))

    en = listar(a.playlist, a.ate)
    pt = {vid: limpar(t) for _, vid, t in listar(a.playlist, a.ate, pt=True)}
    with ThreadPoolExecutor(12) as ex:
        ok = list(ex.map(lambda item: embed_ok(item[1]), en))

    episodios, fora = [], []
    for (n, vid, t), valido in zip(en, ok):
        if not valido:
            fora.append(n)
            continue
        titulo_en = limpar(t)
        episodios.append({"n": n, "id": vid, "title": pt.get(vid, titulo_en),
                          "title_en": titulo_en, "season": secao_de(n, secoes)})

    with open(a.saida, "w", encoding="utf-8") as f:
        json.dump({"title": a.titulo, "source": a.playlist, "episodes": episodios},
                  f, ensure_ascii=False, indent=1)
    print("%d episódios gravados em %s" % (len(episodios), a.saida))
    if fora:
        print("Sem permissão de embed / indisponíveis (ficaram de fora):", fora, file=sys.stderr)
    titulos = {}
    for e in episodios:
        titulos.setdefault(e["title"], []).append(e["n"])
    repetidos = {t: ns for t, ns in titulos.items() if len(ns) > 1}
    if repetidos:
        print("Títulos repetidos (corrigir à mão):", repetidos, file=sys.stderr)


if __name__ == "__main__":
    main()
