package ru.asd.commgames

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat

/**
 * Главный (и единственный) экран приложения.
 *
 * Внутри — WebView, который показывает интерфейс из папки assets/www.
 * Файлы отдаются через WebViewAssetLoader по адресу
 * https://appassets.androidplatform.net/assets/www/... — так работают
 * и fetch, и localStorage, и относительные пути, и всё это без интернета.
 *
 * Данные (аккаунты, прогресс, настройки) лежат в SQLite — см. AndroidBridge.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var bridge: AndroidBridge
    private lateinit var assetLoader: WebViewAssetLoader

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Меняем тему-заставку на обычную тему приложения
        setTheme(R.style.Theme_KommunikativnyeIgry)

        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true)
        }

        assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        bridge = AndroidBridge(this) {
            runOnUiThread { finish() }
        }

        webView = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(BACKGROUND_COLOR)
        }

        with(webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            // Озвучка должна играть без дополнительного касания экрана
            mediaPlaybackRequiresUserGesture = false
            allowFileAccess = false
            allowContentAccess = false
            cacheMode = WebSettings.LOAD_DEFAULT
            textZoom = 100
            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false
        }

        // Мост в базу данных SQLite
        webView.addJavascriptInterface(bridge, "AndroidDB")

        webView.webViewClient = object : WebViewClientCompat() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                val url = request.url
                // Свои страницы открываем в приложении
                if (url.host == ASSET_HOST) return false
                // Внешние ссылки (например, mailto:) отдаём системе
                return try {
                    startActivity(Intent(Intent.ACTION_VIEW, url))
                    true
                } catch (e: Exception) {
                    true
                }
            }
        }

        setContentView(webView)
        webView.loadUrl(START_URL)
    }

    /**
     * Системная кнопка «Назад».
     * Сначала спрашиваем интерфейс: может быть, открыта модалка или идёт игра.
     * Если интерфейс не обработал нажатие — закрываем приложение.
     */
    @Deprecated("Используется системный вызов для Android 13 и ниже")
    override fun onBackPressed() {
        webView.evaluateJavascript(
            "(window.androidBack && window.androidBack()) ? 'true' : 'false'"
        ) { result ->
            if (result == null || !result.contains("true")) {
                @Suppress("DEPRECATION")
                super.onBackPressed()
            }
        }
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    companion object {
        private const val ASSET_HOST = "appassets.androidplatform.net"
        private const val START_URL = "https://$ASSET_HOST/assets/www/index.html"
        private const val BACKGROUND_COLOR = 0xFFFFF4DE.toInt()
    }
}
