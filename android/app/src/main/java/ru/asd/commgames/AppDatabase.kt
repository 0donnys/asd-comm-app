package ru.asd.commgames

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

/**
 * База данных приложения (SQLite).
 *
 * Таблицы:
 *  - accounts   — аккаунты детей: профиль и суммарная статистика;
 *  - progress   — прогресс аккаунта по каждому сценарию
 *                 (одна строка = один сценарий одного ребёнка);
 *  - settings   — настройки устройства (звук, озвучка, подсказки, анимации);
 *  - app_state  — служебные значения (например, id активного аккаунта).
 *
 * Связь: progress.account_id → accounts.id (ON DELETE CASCADE),
 * то есть при удалении аккаунта его прогресс удаляется автоматически.
 */
class AppDatabase(context: Context) : SQLiteOpenHelper(context, DB_NAME, null, DB_VERSION) {

    override fun onConfigure(db: SQLiteDatabase) {
        super.onConfigure(db)
        // Включаем проверку внешних ключей — нужно для ON DELETE CASCADE
        db.setForeignKeyConstraintsEnabled(true)
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(SQL_CREATE_ACCOUNTS)
        db.execSQL(SQL_CREATE_PROGRESS)
        db.execSQL(SQL_CREATE_PROGRESS_INDEX)
        db.execSQL(SQL_CREATE_SETTINGS)
        db.execSQL(SQL_CREATE_APP_STATE)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // Схема пока одна. При изменении структуры миграции пишутся здесь.
    }

    companion object {
        const val DB_NAME = "asd_comm.db"
        const val DB_VERSION = 1

        const val TABLE_ACCOUNTS = "accounts"
        const val TABLE_PROGRESS = "progress"
        const val TABLE_SETTINGS = "settings"
        const val TABLE_APP_STATE = "app_state"

        /** id активного аккаунта в таблице app_state */
        const val KEY_ACTIVE_ID = "active_account_id"

        private const val SQL_CREATE_ACCOUNTS = """
            CREATE TABLE accounts (
                id            TEXT    PRIMARY KEY NOT NULL,
                name          TEXT    NOT NULL DEFAULT '',
                email         TEXT    NOT NULL DEFAULT '',
                gender        TEXT    NOT NULL DEFAULT 'girl',
                avatar        TEXT    NOT NULL DEFAULT '',
                registered    INTEGER NOT NULL DEFAULT 0,
                verified      INTEGER NOT NULL DEFAULT 0,
                created_at    INTEGER NOT NULL DEFAULT 0,
                total_correct INTEGER NOT NULL DEFAULT 0,
                total_wrong   INTEGER NOT NULL DEFAULT 0
            )
        """

        private const val SQL_CREATE_PROGRESS = """
            CREATE TABLE progress (
                account_id   TEXT    NOT NULL,
                scenario_id  TEXT    NOT NULL,
                stars        INTEGER NOT NULL DEFAULT 0,
                completed    INTEGER NOT NULL DEFAULT 0,
                attempts     INTEGER NOT NULL DEFAULT 0,
                last_played  INTEGER NOT NULL DEFAULT 0,
                last_correct INTEGER NOT NULL DEFAULT 0,
                last_wrong   INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY (account_id, scenario_id),
                FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE
            )
        """

        private const val SQL_CREATE_PROGRESS_INDEX =
            "CREATE INDEX idx_progress_account ON progress (account_id)"

        private const val SQL_CREATE_SETTINGS = """
            CREATE TABLE settings (
                key   TEXT PRIMARY KEY NOT NULL,
                value TEXT NOT NULL
            )
        """

        private const val SQL_CREATE_APP_STATE = """
            CREATE TABLE app_state (
                key   TEXT PRIMARY KEY NOT NULL,
                value TEXT
            )
        """
    }
}
