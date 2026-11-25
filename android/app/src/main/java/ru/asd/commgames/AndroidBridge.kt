package ru.asd.commgames

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.webkit.JavascriptInterface
import org.json.JSONObject

/**
 * Мост между JavaScript и базой данных SQLite.
 *
 * Объект добавляется в WebView под именем AndroidDB, поэтому из страницы
 * можно вызывать AndroidDB.getState(), AndroidDB.saveState(json) и т.д.
 *
 * Вызовы @JavascriptInterface выполняются синхронно, поэтому вся логика
 * приложения на JavaScript может остаться прежней (без промисов и await).
 */
class AndroidBridge(context: Context, private val onExit: () -> Unit = {}) {

    private val helper = AppDatabase(context.applicationContext)

    /** Полное состояние приложения, собранное из таблиц базы данных. */
    @JavascriptInterface
    fun getState(): String {
        val db = helper.readableDatabase
        val root = JSONObject()
        val accountsObj = JSONObject()

        db.query(
            AppDatabase.TABLE_ACCOUNTS, null, null, null, null, null, "created_at ASC"
        ).use { c ->
            val iId = c.getColumnIndexOrThrow("id")
            val iName = c.getColumnIndexOrThrow("name")
            val iEmail = c.getColumnIndexOrThrow("email")
            val iGender = c.getColumnIndexOrThrow("gender")
            val iAvatar = c.getColumnIndexOrThrow("avatar")
            val iRegistered = c.getColumnIndexOrThrow("registered")
            val iVerified = c.getColumnIndexOrThrow("verified")
            val iCorrect = c.getColumnIndexOrThrow("total_correct")
            val iWrong = c.getColumnIndexOrThrow("total_wrong")

            while (c.moveToNext()) {
                val id = c.getString(iId)

                val profile = JSONObject()
                    .put("name", c.getString(iName))
                    .put("email", c.getString(iEmail))
                    .put("gender", c.getString(iGender))
                    .put("avatar", c.getString(iAvatar))
                    .put("registered", c.getInt(iRegistered) == 1)
                    .put("verified", c.getInt(iVerified) == 1)

                val stats = JSONObject()
                    .put("correct", c.getInt(iCorrect))
                    .put("wrong", c.getInt(iWrong))

                val progress = JSONObject()
                db.query(
                    AppDatabase.TABLE_PROGRESS, null,
                    "account_id = ?", arrayOf(id), null, null, null
                ).use { p ->
                    val pScenario = p.getColumnIndexOrThrow("scenario_id")
                    val pStars = p.getColumnIndexOrThrow("stars")
                    val pCompleted = p.getColumnIndexOrThrow("completed")
                    val pAttempts = p.getColumnIndexOrThrow("attempts")
                    val pPlayed = p.getColumnIndexOrThrow("last_played")
                    val pCorrect = p.getColumnIndexOrThrow("last_correct")
                    val pWrong = p.getColumnIndexOrThrow("last_wrong")

                    while (p.moveToNext()) {
                        progress.put(
                            p.getString(pScenario),
                            JSONObject()
                                .put("stars", p.getInt(pStars))
                                .put("completed", p.getInt(pCompleted) == 1)
                                .put("attempts", p.getInt(pAttempts))
                                .put("lastPlayed", p.getLong(pPlayed))
                                .put("lastCorrect", p.getInt(pCorrect))
                                .put("lastWrong", p.getInt(pWrong))
                        )
                    }
                }

                accountsObj.put(
                    id,
                    JSONObject()
                        .put("profile", profile)
                        .put("progress", progress)
                        .put("stats", stats)
                )
            }
        }

        root.put("accounts", accountsObj)

        val settings = JSONObject()
        db.query(AppDatabase.TABLE_SETTINGS, null, null, null, null, null, null).use { c ->
            while (c.moveToNext()) {
                settings.put(c.getString(0), parseValue(c.getString(1)))
            }
        }
        root.put("settings", settings)

        val activeId = readAppState(db, AppDatabase.KEY_ACTIVE_ID)
        root.put("activeId", activeId ?: JSONObject.NULL)

        return root.toString()
    }

    /**
     * Сохраняет состояние в базу данных.
     * Каждому аккаунту — строка в accounts, каждому сценарию — строка в progress.
     * То, чего больше нет в присланном состоянии, удаляется из базы
     * (аккаунт вместе со своим прогрессом — за счёт ON DELETE CASCADE).
     */
    @JavascriptInterface
    fun saveState(json: String) {
        val root = JSONObject(json)
        val db = helper.writableDatabase

        db.beginTransaction()
        try {
            /* ---------- аккаунты и их прогресс ---------- */
            val accounts = root.optJSONObject("accounts") ?: JSONObject()
            val keepAccounts = ArrayList<String>()
            val accountKeys = accounts.keys()
            while (accountKeys.hasNext()) {
                val id = accountKeys.next()
                keepAccounts.add(id)
                upsertAccount(db, id, accounts.optJSONObject(id) ?: JSONObject())
            }
            if (keepAccounts.isEmpty()) {
                db.delete(AppDatabase.TABLE_ACCOUNTS, null, null)
            } else {
                val placeholders = keepAccounts.joinToString(",") { "?" }
                db.delete(
                    AppDatabase.TABLE_ACCOUNTS,
                    "id NOT IN ($placeholders)",
                    keepAccounts.toTypedArray()
                )
            }

            /* ---------- настройки ---------- */
            val settings = root.optJSONObject("settings") ?: JSONObject()
            val keepSettings = ArrayList<String>()
            val settingKeys = settings.keys()
            while (settingKeys.hasNext()) {
                val key = settingKeys.next()
                keepSettings.add(key)
                val values = ContentValues().apply {
                    put("key", key)
                    put("value", settings.get(key).toString())
                }
                if (db.update(
                        AppDatabase.TABLE_SETTINGS, values, "key = ?", arrayOf(key)
                    ) == 0
                ) {
                    db.insert(AppDatabase.TABLE_SETTINGS, null, values)
                }
            }
            if (keepSettings.isEmpty()) {
                db.delete(AppDatabase.TABLE_SETTINGS, null, null)
            } else {
                val placeholders = keepSettings.joinToString(",") { "?" }
                db.delete(
                    AppDatabase.TABLE_SETTINGS,
                    "key NOT IN ($placeholders)",
                    keepSettings.toTypedArray()
                )
            }

            /* ---------- активный аккаунт ---------- */
            val activeRaw = if (root.isNull("activeId")) null else root.opt("activeId")
            val activeId = when (activeRaw) {
                is String -> activeRaw.takeIf { it.isNotEmpty() && it != "null" }
                else -> null
            }
            if (activeId == null) {
                db.delete(
                    AppDatabase.TABLE_APP_STATE, "key = ?",
                    arrayOf(AppDatabase.KEY_ACTIVE_ID)
                )
            } else {
                val values = ContentValues().apply {
                    put("key", AppDatabase.KEY_ACTIVE_ID)
                    put("value", activeId)
                }
                if (db.update(
                        AppDatabase.TABLE_APP_STATE, values, "key = ?",
                        arrayOf(AppDatabase.KEY_ACTIVE_ID)
                    ) == 0
                ) {
                    db.insert(AppDatabase.TABLE_APP_STATE, null, values)
                }
            }

            db.setTransactionSuccessful()
        } finally {
            db.endTransaction()
        }
    }

    /** Сведения о базе — показываются в настройках приложения. */
    @JavascriptInterface
    fun dbInfo(): String {
        val db = helper.readableDatabase
        val root = JSONObject()
        root.put("database", AppDatabase.DB_NAME)
        root.put("version", AppDatabase.DB_VERSION)
        root.put("path", db.path)
        root.put("accounts", count(db, AppDatabase.TABLE_ACCOUNTS))
        root.put("progress", count(db, AppDatabase.TABLE_PROGRESS))
        root.put("settings", count(db, AppDatabase.TABLE_SETTINGS))
        return root.toString()
    }

    /**
     * Закрыть приложение (кнопка «Закрыть приложение» в настройках).
     * Вызывается из JavaScript, поэтому закрытие выполняет Activity
     * через переданный колбэк — обязательно в потоке интерфейса.
     */
    @JavascriptInterface
    fun exitApp() {
        onExit()
    }

    /* ------------------------------------------------------------------ */

    private fun upsertAccount(db: SQLiteDatabase, id: String, account: JSONObject) {
        val profile = account.optJSONObject("profile") ?: JSONObject()
        val stats = account.optJSONObject("stats") ?: JSONObject()

        val values = ContentValues().apply {
            put("id", id)
            put("name", profile.optString("name", ""))
            put("email", profile.optString("email", ""))
            put("gender", profile.optString("gender", "girl"))
            put("avatar", profile.optString("avatar", ""))
            put("registered", if (profile.optBoolean("registered", false)) 1 else 0)
            put("verified", if (profile.optBoolean("verified", false)) 1 else 0)
            put("total_correct", stats.optInt("correct", 0))
            put("total_wrong", stats.optInt("wrong", 0))
        }

        // created_at существующей строки не меняем
        val updated = db.update(AppDatabase.TABLE_ACCOUNTS, values, "id = ?", arrayOf(id))
        if (updated == 0) {
            values.put("created_at", System.currentTimeMillis())
            db.insert(AppDatabase.TABLE_ACCOUNTS, null, values)
        }

        upsertProgress(db, id, account.optJSONObject("progress") ?: JSONObject())
    }

    private fun upsertProgress(db: SQLiteDatabase, accountId: String, progress: JSONObject) {
        val keepScenarios = ArrayList<String>()
        val keys = progress.keys()
        while (keys.hasNext()) {
            val scenarioId = keys.next()
            keepScenarios.add(scenarioId)
            val p = progress.optJSONObject(scenarioId) ?: JSONObject()

            val values = ContentValues().apply {
                put("account_id", accountId)
                put("scenario_id", scenarioId)
                put("stars", p.optInt("stars", 0))
                put("completed", if (p.optBoolean("completed", false)) 1 else 0)
                put("attempts", p.optInt("attempts", 0))
                put("last_played", p.optLong("lastPlayed", 0L))
                put("last_correct", p.optInt("lastCorrect", 0))
                put("last_wrong", p.optInt("lastWrong", 0))
            }

            val updated = db.update(
                AppDatabase.TABLE_PROGRESS, values,
                "account_id = ? AND scenario_id = ?", arrayOf(accountId, scenarioId)
            )
            if (updated == 0) {
                db.insert(AppDatabase.TABLE_PROGRESS, null, values)
            }
        }

        if (keepScenarios.isEmpty()) {
            db.delete(AppDatabase.TABLE_PROGRESS, "account_id = ?", arrayOf(accountId))
        } else {
            val placeholders = keepScenarios.joinToString(",") { "?" }
            val args = ArrayList<String>()
            args.add(accountId)
            args.addAll(keepScenarios)
            db.delete(
                AppDatabase.TABLE_PROGRESS,
                "account_id = ? AND scenario_id NOT IN ($placeholders)",
                args.toTypedArray()
            )
        }
    }

    private fun readAppState(db: SQLiteDatabase, key: String): String? {
        db.query(
            AppDatabase.TABLE_APP_STATE, arrayOf("value"),
            "key = ?", arrayOf(key), null, null, null
        ).use { c ->
            if (c.moveToFirst()) return c.getString(0)
        }
        return null
    }

    private fun count(db: SQLiteDatabase, table: String): Int {
        db.rawQuery("SELECT COUNT(*) FROM $table", null).use { c ->
            return if (c.moveToFirst()) c.getInt(0) else 0
        }
    }

    /** Значения настроек храним строками, но отдаём в JS в исходном виде. */
    private fun parseValue(raw: String): Any = when (raw) {
        "true" -> true
        "false" -> false
        else -> raw
    }
}
