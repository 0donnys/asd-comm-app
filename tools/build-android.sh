#!/bin/bash
# Полная сборка Android-приложения: копирует веб-часть в APK и запускает Gradle.
#
#   bash tools/build-android.sh            # debug-сборка (app-debug.apk)
#   bash tools/build-android.sh release    # release-сборка
#   bash tools/build-android.sh install    # собрать debug и поставить на подключённое устройство/эмулятор

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-debug}"

# JDK 21 (Android Gradle Plugin не работает на слишком новых JDK)
if [ -d "/opt/homebrew/opt/openjdk@21" ]; then
  export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
elif [ -d "/usr/local/opt/openjdk@21" ]; then
  export JAVA_HOME="/usr/local/opt/openjdk@21"
fi

# Android SDK
if [ -z "$ANDROID_HOME" ]; then
  for p in /opt/homebrew/share/android-commandlinetools "$HOME/Library/Android/sdk"; do
    if [ -d "$p" ]; then export ANDROID_HOME="$p"; break; fi
  done
fi
export ANDROID_SDK_ROOT="${ANDROID_HOME:-}"

echo "JAVA_HOME   = ${JAVA_HOME:-<по умолчанию>}"
echo "ANDROID_HOME= ${ANDROID_HOME:-<не найден>}"
echo

bash "$ROOT/tools/copy-web.sh"
echo

cd "$ROOT/android"
chmod +x ./gradlew 2>/dev/null || true

case "$MODE" in
  release)
    ./gradlew assembleRelease
    echo
    echo "APK: android/app/build/outputs/apk/release/app-release.apk"
    ;;
  install)
    ./gradlew assembleDebug
    APK="app/build/outputs/apk/debug/app-debug.apk"
    adb install -r "$APK"
    adb shell am start -n ru.asd.commgames.debug/ru.asd.commgames.MainActivity
    ;;
  *)
    ./gradlew assembleDebug
    echo
    echo "APK: android/app/build/outputs/apk/debug/app-debug.apk"
    ;;
esac
