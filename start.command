#!/bin/zsh
# Запуск приложения локально и открытие в браузере
cd "$(dirname "$0")"
PORT=8765

if lsof -i :$PORT >/dev/null 2>&1; then
  echo "Сервер уже запущен на порту $PORT"
  open "http://localhost:$PORT"
  exit 0
fi

echo "Запускаю приложение на http://localhost:$PORT"
python3 -m http.server $PORT >/dev/null 2>&1 &
SERVER_PID=$!
sleep 1
open "http://localhost:$PORT"

echo "Чтобы остановить сервер — закрой это окно или нажми Ctrl+C."
wait $SERVER_PID
