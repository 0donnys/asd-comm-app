#!/bin/bash
# Копирует веб-часть приложения (HTML, CSS, JS, картинки, звуки)
# в папку ресурсов Android-проекта: android/app/src/main/assets/www
#
# Запускать из корня проекта:  bash tools/copy-web.sh

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/android/app/src/main/assets/www"

echo "Откуда: $ROOT"
echo "Куда:   $DEST"

rm -rf "$DEST"
mkdir -p "$DEST"

cd "$ROOT"
# Копируем только то, что нужно приложению
for item in index.html manifest.webmanifest sw.js css js data assets; do
  if [ -e "$item" ]; then
    cp -R "$item" "$DEST/"
  fi
done

# Служебный мусор в APK не нужен
find "$DEST" -name '.DS_Store' -delete 2>/dev/null || true
find "$DEST" -name '*.map' -delete 2>/dev/null || true

COUNT=$(find "$DEST" -type f | wc -l | tr -d ' ')
SIZE=$(du -sh "$DEST" | cut -f1)
echo "Готово: файлов $COUNT, объём $SIZE"
