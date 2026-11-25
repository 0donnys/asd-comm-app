#!/usr/bin/env python3
# Собирает список всех картинок и звуков в assets/assets-manifest.json.
# Этот файл читает service worker (sw.js) и заранее кеширует всё,
# чтобы приложение работало офлайн сразу после установки.
#
# Запуск:  python3 tools/make-assets-manifest.py
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "assets-manifest.json")

DIRS = [
    ("assets/img", (".svg", ".png")),
    ("assets/audio", (".mp3",)),
]


def main():
    files = []
    for rel_dir, exts in DIRS:
        abs_dir = os.path.join(ROOT, rel_dir)
        if not os.path.isdir(abs_dir):
            continue
        for name in sorted(os.listdir(abs_dir)):
            if name.lower().endswith(exts):
                files.append(rel_dir + "/" + name)

    payload = {"version": 1, "files": files}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    print("Записано %d файлов в %s" % (len(files), os.path.relpath(OUT, ROOT)))


if __name__ == "__main__":
    main()
