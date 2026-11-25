#!/usr/bin/env python3
# Собирает тексты реплик из сценариев (data/scenarios/*.js) и дописывает их
# в data/voices.json. Ключ = "<сценарий>.<id>", для мужского варианта — "<...>.boy".
#
# Запуск:  python3 tools/extract-voices.py
#
# После этого озвучку генерирует make-voices.py (он пропускает уже готовые mp3).
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCEN_DIR = os.path.join(ROOT, "data", "scenarios")
VOICES = os.path.join(ROOT, "data", "voices.json")

# v('id', 'текст'[, 'текст_для_мальчика'])
CALL = re.compile(
    r"\bv\(\s*'([^']*)'\s*,\s*'([^']*)'\s*(?:,\s*'([^']*)'\s*)?\)",
    re.S,
)


def extract(path, prefix):
    with open(path, "r", encoding="utf-8") as f:
        src = f.read()
    found = {}
    for m in CALL.finditer(src):
        lid, text, boy = m.group(1), m.group(2), m.group(3)
        found[prefix + "." + lid] = text
        if boy:
            found[prefix + "." + lid + ".boy"] = boy
    return found


def main():
    if os.path.exists(VOICES):
        with open(VOICES, "r", encoding="utf-8") as f:
            voices = json.load(f)
    else:
        voices = {}

    files = sorted(f for f in os.listdir(SCEN_DIR) if f.endswith(".js"))
    added = updated = 0
    for fn in files:
        prefix = fn[:-3]
        lines = extract(os.path.join(SCEN_DIR, fn), prefix)
        for key, text in lines.items():
            if key not in voices:
                added += 1
            elif voices[key] != text:
                updated += 1
            voices[key] = text
        print("%-16s %d реплик" % (fn, len(lines)))

    with open(VOICES, "w", encoding="utf-8") as f:
        json.dump(voices, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print("Новых: %d, изменённых: %d, всего в voices.json: %d" % (added, updated, len(voices)))


if __name__ == "__main__":
    main()
