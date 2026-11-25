#!/usr/bin/env python3
"""Мини-клиент Chrome DevTools Protocol.

Нужен, чтобы отлаживать WebView внутри Android-эмулятора: выполнять
JavaScript прямо в работающем приложении и смотреть его состояние.

Как пользоваться (внутри уже запущенного эмулятора с debug-сборкой):

    adb forward tcp:9222 localabstract:webview_devtools_remote_<PID>
    python3 tools/cdp.py eval "JSON.stringify(Store.get().profile)"
    python3 tools/cdp.py eval --file /tmp/script.js
    python3 tools/cdp.py targets

Используется только стандартная библиотека Python.
"""

import argparse
import base64
import json
import os
import socket
import struct
import sys
import urllib.request

HOST = "127.0.0.1"
PORT = int(os.environ.get("CDP_PORT", "9222"))
# Сколько ждать ответа на один вызов. Длинные автотесты в WebView
# (полное прохождение сценария) могут занимать больше минуты.
TIMEOUT = float(os.environ.get("CDP_TIMEOUT", "30"))


class WebSocket:
    """Очень маленький клиент WebSocket (только то, что нужно CDP)."""

    def __init__(self, url):
        assert url.startswith("ws://"), url
        hostport, path = url[5:].split("/", 1)
        host, port = hostport.rsplit(":", 1)
        self.sock = socket.create_connection((host, int(port)), timeout=TIMEOUT)
        key = base64.b64encode(os.urandom(16)).decode()
        request = (
            "GET /%s HTTP/1.1\r\n"
            "Host: %s\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            "Sec-WebSocket-Key: %s\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n" % (path, hostport, key)
        )
        self.sock.sendall(request.encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            chunk = self.sock.recv(4096)
            if not chunk:
                raise RuntimeError("не удалось подключиться к %s" % url)
            buf += chunk
        head, self._buf = buf.split(b"\r\n\r\n", 1)
        if b" 101 " not in head.split(b"\r\n")[0]:
            raise RuntimeError("WebSocket handshake failed: %s" % head.split(b"\r\n")[0])

    def _read(self, n):
        while len(self._buf) < n:
            chunk = self.sock.recv(65536)
            if not chunk:
                raise EOFError("соединение закрыто")
            self._buf += chunk
        out, self._buf = self._buf[:n], self._buf[n:]
        return out

    def send(self, text):
        payload = text.encode("utf-8")
        header = bytearray([0x81])
        n = len(payload)
        if n < 126:
            header.append(0x80 | n)
        elif n < 65536:
            header.append(0x80 | 126)
            header += struct.pack(">H", n)
        else:
            header.append(0x80 | 127)
            header += struct.pack(">Q", n)
        mask = os.urandom(4)
        header += mask
        header += bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
        self.sock.sendall(bytes(header))

    def recv(self):
        while True:
            b1, b2 = self._read(2)
            opcode = b1 & 0x0F
            length = b2 & 0x7F
            if length == 126:
                length = struct.unpack(">H", self._read(2))[0]
            elif length == 127:
                length = struct.unpack(">Q", self._read(8))[0]
            mask = self._read(4) if (b2 & 0x80) else None
            data = self._read(length)
            if mask:
                data = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
            if opcode == 0x8:
                raise EOFError("соединение закрыто сервером")
            if opcode in (0x9, 0xA):  # ping / pong
                continue
            return data.decode("utf-8", "replace")

    def close(self):
        try:
            self.sock.close()
        except OSError:
            pass


def http_json(path):
    with urllib.request.urlopen("http://%s:%d%s" % (HOST, PORT, path), timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def pick_target():
    targets = http_json("/json")
    pages = [t for t in targets if t.get("type") == "page" and t.get("webSocketDebuggerUrl")]
    if not pages:
        raise SystemExit("Не найдено ни одной страницы. Запущено ли приложение в эмуляторе?")
    # Берём страницу самого приложения
    for t in pages:
        if "index.html" in (t.get("url") or ""):
            return t
    return pages[0]


class CDP:
    def __init__(self, ws_url):
        self.ws = WebSocket(ws_url)
        self.next_id = 1

    def call(self, method, params=None):
        msg_id = self.next_id
        self.next_id += 1
        self.ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == msg_id:
                if "error" in msg:
                    raise RuntimeError(msg["error"].get("message", str(msg["error"])))
                return msg.get("result", {})

    def evaluate(self, script):
        result = self.call(
            "Runtime.evaluate",
            {
                "expression": script,
                "returnByValue": True,
                "awaitPromise": True,
                "userGesture": True,
            },
        )
        if result.get("exceptionDetails"):
            details = result["exceptionDetails"]
            text = details.get("exception", {}).get("description") or details.get("text")
            raise RuntimeError("Ошибка в JS: %s" % text)
        return result.get("result", {}).get("value")

    def close(self):
        self.ws.close()


def main():
    parser = argparse.ArgumentParser(description="CDP-клиент для отладки WebView")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("targets", help="список страниц в WebView")

    ev = sub.add_parser("eval", help="выполнить JavaScript в приложении")
    ev.add_argument("script", nargs="?", help="код на JavaScript")
    ev.add_argument("--file", help="взять код из файла")

    args = parser.parse_args()

    if args.command == "targets":
        print(json.dumps(http_json("/json"), ensure_ascii=False, indent=2))
        return

    script = args.script
    if args.file:
        with open(args.file, encoding="utf-8") as fh:
            script = fh.read()
    if not script:
        script = sys.stdin.read()

    cdp = CDP(pick_target()["webSocketDebuggerUrl"])
    try:
        value = cdp.evaluate(script)
    finally:
        cdp.close()

    if isinstance(value, str):
        print(value)
    else:
        print(json.dumps(value, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
