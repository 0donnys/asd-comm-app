#!/usr/bin/env python3
# Генерация озвучки всех реплик.
#
# Основной голос — ru-RU-SvetlanaNeural (мягкий женский) через edge-tts.
# Если edge-tts недоступен и нет сети — запасной вариант: системный macOS-голос Milena.
#
# Запуск:  python3 tools/make-voices.py
# Можно передать конкретные id: python3 tools/make-voices.py shop.s1.intro
#
# При первом запуске рядом (tools/.venv) автоматически создаётся окружение
# с edge-tts — нужен только интернет.
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICES = os.path.join(ROOT, "data", "voices.json")
OUT = os.path.join(ROOT, "assets", "audio")
VENV = os.path.join(ROOT, "tools", ".venv")
LOCAL_EDGE = os.path.join(VENV, "bin", "edge-tts")

# Настройки голоса: чуть медленнее и чуть выше — звучит мягче и дружелюбнее.
VOICE = "ru-RU-SvetlanaNeural"
RATE = "-8%"
PITCH = "+3Hz"


def log(msg):
    print(msg, flush=True)


def ensure_edge_tts():
    """Возвращает путь к edge-tts, при необходимости создаёт venv и ставит пакет."""
    if os.path.exists(LOCAL_EDGE):
        return LOCAL_EDGE

    found = shutil.which("edge-tts")
    if found:
        return found

    log("Первый запуск: устанавливаю edge-tts (нужен интернет)…")
    os.makedirs(VENV, exist_ok=True)
    base_python = "/usr/bin/python3" if os.path.exists("/usr/bin/python3") else sys.executable
    subprocess.run([base_python, "-m", "venv", VENV], check=True)
    subprocess.run(
        [os.path.join(VENV, "bin", "pip"), "install", "--quiet", "--upgrade", "pip"],
        check=True,
    )
    subprocess.run(
        [os.path.join(VENV, "bin", "pip"), "install", "--quiet", "edge-tts"],
        check=True,
    )
    return LOCAL_EDGE


def synth_edge(edge, text, out_path):
    subprocess.run(
        [
            edge,
            "--voice", VOICE,
            "--rate=" + RATE,
            "--pitch=" + PITCH,
            "--text", text,
            "--write-media", out_path,
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )


def synth_say(text, out_path):
    """Запасной системный голос macOS (если edge-tts недоступен)."""
    tmp = os.path.join(OUT, "_tmp.aiff")
    subprocess.run(["say", "-v", "Milena", "-r", "160", "-o", tmp, text], check=True)
    subprocess.run(
        ["afconvert", "-f", "m4af", "-d", "aac", "-b", "64000", tmp, out_path],
        check=True,
    )
    if os.path.exists(tmp):
        os.remove(tmp)


def main():
    os.makedirs(OUT, exist_ok=True)

    with open(VOICES, "r", encoding="utf-8") as f:
        texts = json.load(f)

    only = set(sys.argv[1:])
    items = [(k, v) for k, v in texts.items() if not only or k in only]

    edge = None
    try:
        edge = ensure_edge_tts()
    except Exception as e:  # нет сети / не удалось поставить
        log("edge-tts недоступен: " + str(e))
        log("Использую запасной голос Milena.")

    done = 0
    for key, text in items:
        out_path = os.path.join(OUT, key + ".mp3")
        if os.path.exists(out_path) and not only:
            done += 1
            continue
        if edge:
            synth_edge(edge, text, out_path)
        else:
            synth_say(text, out_path)
        done += 1
        log("ok: " + key)

    log("Готово: %d реплик в %s" % (done, OUT))


if __name__ == "__main__":
    main()
