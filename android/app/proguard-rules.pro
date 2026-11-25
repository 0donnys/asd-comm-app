# Правила ProGuard/R8. Минификация отключена (minifyEnabled false),
# но файл оставлен для возможной оптимизации в будущем.

# Сохраняем методы, которые вызываются из JavaScript через мост
-keepclassmembers class ru.asd.commgames.AndroidBridge {
    public *;
}
-keepattributes JavascriptInterface
