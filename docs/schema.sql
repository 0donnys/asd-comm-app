-- ============================================================
--  База данных приложения «Коммуникативные игры»
--  СУБД: SQLite 3 (встроена в Android)
--  Файл базы на устройстве: /data/data/ru.asd.commgames/databases/asd_comm.db
--
--  Этот файл полностью совпадает с тем, что выполняется
--  в приложении при первом запуске (класс AppDatabase.kt).
-- ============================================================

PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------
-- 1. Аккаунты детей
--    Один аккаунт = один ребёнок со своим профилем и статистикой.
-- ------------------------------------------------------------
CREATE TABLE accounts (
    id            TEXT    PRIMARY KEY NOT NULL,   -- внутренний id, например acc_lz3k1a_x9p2q
    name          TEXT    NOT NULL DEFAULT '',    -- имя ребёнка
    email         TEXT    NOT NULL DEFAULT '',    -- почта взрослого (для кода подтверждения)
    gender        TEXT    NOT NULL DEFAULT 'girl',-- 'girl' или 'boy' — влияет на картинки и текст
    avatar        TEXT    NOT NULL DEFAULT '',    -- смайлик-аватар ребёнка, например 👧
    registered    INTEGER NOT NULL DEFAULT 0,     -- 0/1 — регистрация завершена
    verified      INTEGER NOT NULL DEFAULT 0,     -- 0/1 — почта подтверждена кодом
    created_at    INTEGER NOT NULL DEFAULT 0,     -- время создания (миллисекунды Unix)
    total_correct INTEGER NOT NULL DEFAULT 0,     -- всего правильных ответов
    total_wrong   INTEGER NOT NULL DEFAULT 0      -- всего ошибок
);

-- ------------------------------------------------------------
-- 2. Прогресс по сценариям
--    Одна строка = один сценарий одного ребёнка.
--    Составной первичный ключ не даёт завести два прогресса
--    по одному сценарию для одного аккаунта.
-- ------------------------------------------------------------
CREATE TABLE progress (
    account_id   TEXT    NOT NULL,                -- ссылка на accounts.id
    scenario_id  TEXT    NOT NULL,                -- 'shop', 'friend', 'playground', 'school'
    stars        INTEGER NOT NULL DEFAULT 0,      -- лучший результат: 0..3 звезды
    completed    INTEGER NOT NULL DEFAULT 0,      -- 0/1 — сценарий пройден до конца
    attempts     INTEGER NOT NULL DEFAULT 0,      -- сколько раз проходили
    last_played  INTEGER NOT NULL DEFAULT 0,      -- когда играли в последний раз
    last_correct INTEGER NOT NULL DEFAULT 0,      -- правильных ответов в последнем прохождении
    last_wrong   INTEGER NOT NULL DEFAULT 0,      -- ошибок в последнем прохождении

    PRIMARY KEY (account_id, scenario_id),

    -- При удалении аккаунта его прогресс удаляется автоматически
    FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE
);

-- Ускоряет выборку прогресса конкретного ребёнка
CREATE INDEX idx_progress_account ON progress (account_id);

-- ------------------------------------------------------------
-- 3. Настройки устройства (общие для всех аккаунтов)
--    Хранятся как «ключ — значение», чтобы легко добавлять новые.
-- ------------------------------------------------------------
CREATE TABLE settings (
    key   TEXT PRIMARY KEY NOT NULL,              -- 'sound', 'voice', 'adult', 'animations'
    value TEXT NOT NULL                           -- 'true' / 'false'
);

-- ------------------------------------------------------------
-- 4. Служебное состояние приложения
-- ------------------------------------------------------------
CREATE TABLE app_state (
    key   TEXT PRIMARY KEY NOT NULL,              -- 'active_account_id'
    value TEXT                                    -- id аккаунта, который сейчас играет
);

-- ============================================================
--  Примеры запросов, которые использует приложение
-- ============================================================

-- Кто играет? — список аккаунтов с числом пройденных игр и звёздами
-- SELECT a.id, a.name, a.avatar,
--        COUNT(CASE WHEN p.completed = 1 THEN 1 END) AS done_games,
--        COALESCE(SUM(p.stars), 0)                   AS stars
--   FROM accounts a
--   LEFT JOIN progress p ON p.account_id = a.id
--  GROUP BY a.id
--  ORDER BY a.created_at;

-- Открыть ли следующий сценарий: пройдены ли все предыдущие
-- SELECT scenario_id, completed FROM progress
--  WHERE account_id = ? AND completed = 1;

-- Сохранить результат прохождения сценария
-- INSERT INTO progress (account_id, scenario_id, stars, completed, attempts,
--                       last_played, last_correct, last_wrong)
--      VALUES (?, ?, ?, 1, 1, ?, ?, ?)
-- ON CONFLICT (account_id, scenario_id) DO UPDATE SET
--      stars        = MAX(stars, excluded.stars),
--      completed    = 1,
--      attempts     = attempts + 1,
--      last_played  = excluded.last_played,
--      last_correct = excluded.last_correct,
--      last_wrong   = excluded.last_wrong;

-- Активный аккаунт
-- SELECT value FROM app_state WHERE key = 'active_account_id';
