/* Хранение состояния приложения.

   Есть два хранилища, логика приложения от них не зависит:

   1) Android-приложение: данные лежат в настоящей базе SQLite
      (таблицы accounts, progress, settings, app_state).
      Доступ идёт через мост window.AndroidDB, который приложение
      подставляет в WebView (@JavascriptInterface).

   2) Обычный браузер (для быстрой отладки): те же данные лежат
      в localStorage.

   На одном устройстве может быть несколько аккаунтов (детей).
   У каждого аккаунта — свой профиль, прогресс и статистика.
   Настройки (звук, озвучка, анимации) — общие для устройства. */
window.Store = (function () {
  const KEY = 'asd-comm-accounts-v2';
  const LEGACY_KEY = 'asd-comm-app-v1';

  /* Мост в нативный код. Есть только внутри Android-приложения. */
  const db = (typeof window.AndroidDB !== 'undefined' && window.AndroidDB) ? window.AndroidDB : null;

  const defaultProfile = {
    name: '',
    email: '',
    gender: 'girl',
    avatar: '👧',
    registered: false,
    verified: false
  };
  const defaultSettings = { sound: true, voice: true, adult: true, animations: true };
  const defaultStats = { correct: 0, wrong: 0 };

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  function newState() {
    return { activeId: null, settings: clone(defaultSettings), accounts: {} };
  }

  function emptyAccount(profile) {
    return {
      profile: Object.assign({}, defaultProfile, profile || {}),
      progress: {},
      stats: clone(defaultStats)
    };
  }

  function newId() {
    return 'acc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function normalizeAccount(a) {
    const acc = a || {};
    return {
      profile: Object.assign({}, defaultProfile, acc.profile || {}),
      progress: acc.progress || {},
      stats: Object.assign({}, defaultStats, acc.stats || {})
    };
  }

  /* Собираем состояние из того, что вернуло хранилище (объект) */
  function stateFrom(parsed) {
    const st = newState();
    if (!parsed) return st;
    st.settings = Object.assign({}, defaultSettings, parsed.settings || {});
    const accounts = parsed.accounts || {};
    Object.keys(accounts).forEach(function (id) {
      st.accounts[id] = normalizeAccount(accounts[id]);
    });
    st.activeId = parsed.activeId && st.accounts[parsed.activeId] ? parsed.activeId : null;
    return st;
  }

  /* Переносим данные старого одиночного профиля (только для браузера) */
  function migrateLegacy() {
    try {
      const raw = localStorage.getItem(LEGACY_KEY);
      if (!raw) return null;
      const old = JSON.parse(raw);
      if (!old || !old.profile || !old.profile.registered) return null;

      const st = newState();
      st.settings = Object.assign({}, defaultSettings, old.settings || {});
      const id = newId();
      st.accounts[id] = {
        profile: Object.assign({}, defaultProfile, old.profile),
        progress: old.progress || {},
        stats: Object.assign({}, defaultStats, old.stats || {})
      };
      st.activeId = id;
      return st;
    } catch (e) {
      return null;
    }
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return stateFrom(JSON.parse(raw));
      const migrated = migrateLegacy();
      return migrated || newState();
    } catch (e) {
      return newState();
    }
  }

  function load() {
    if (db) {
      try {
        const raw = db.getState();
        if (raw) return stateFrom(JSON.parse(raw));
      } catch (e) { /* база пустая или недоступна */ }
      return newState();
    }
    return loadLocal();
  }

  let state = load();

  function save() {
    if (db) {
      try { db.saveState(JSON.stringify(state)); } catch (e) { /* ничего не поделать */ }
      return;
    }
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* приватный режим */ }
  }

  /* Если перенесли старый профиль — сразу сохраняем новую структуру */
  if (!db) {
    try {
      if (state.activeId && !localStorage.getItem(KEY)) save();
    } catch (e) { /* приватный режим */ }
  }

  function active() {
    return state.activeId ? state.accounts[state.activeId] : null;
  }

  function view() {
    const a = active();
    return {
      profile: a ? a.profile : clone(defaultProfile),
      settings: state.settings,
      progress: a ? a.progress : {},
      stats: a ? a.stats : clone(defaultStats)
    };
  }

  return {
    get() { return view(); },

    /* ---------- хранилище ---------- */
    /* true, если данные пишутся в SQLite (Android-приложение) */
    isNative() { return !!db; },

    /* Сведения о базе — для проверки, что данные лежат в SQLite */
    dbInfo() {
      if (!db || typeof db.dbInfo !== 'function') return null;
      try { return JSON.parse(db.dbInfo()); } catch (e) { return null; }
    },

    /* Кнопка «Закрыть приложение» есть только в Android-приложении */
    canExitApp() {
      return !!(db && typeof db.exitApp === 'function');
    },

    /* Закрыть приложение (в браузере — ничего не делает) */
    exitApp() {
      if (db && typeof db.exitApp === 'function') {
        try { db.exitApp(); return true; } catch (e) { return false; }
      }
      return false;
    },

    /* ---------- аккаунты ---------- */
    getActiveId() { return state.activeId; },

    listAccounts() {
      return Object.keys(state.accounts).map(function (id) {
        const a = state.accounts[id];
        return { id: id, profile: a.profile, progress: a.progress, stats: a.stats };
      });
    },

    /* Ищем аккаунт с таким же именем и почтой (чтобы не плодить дубли) */
    findAccount(email, name) {
      const e = (email || '').trim().toLowerCase();
      const n = (name || '').trim().toLowerCase();
      const ids = Object.keys(state.accounts);
      for (let i = 0; i < ids.length; i++) {
        const p = state.accounts[ids[i]].profile;
        if ((p.email || '').toLowerCase() === e && (p.name || '').toLowerCase() === n) {
          return ids[i];
        }
      }
      return null;
    },

    createAccount(profile) {
      const id = newId();
      state.accounts[id] = emptyAccount(profile);
      state.activeId = id;
      save();
      return id;
    },

    setActive(id) {
      if (state.accounts[id]) {
        state.activeId = id;
        save();
        return true;
      }
      return false;
    },

    logout() {
      state.activeId = null;
      save();
    },

    /* Полностью удаляем аккаунт вместе с его прогрессом и статистикой */
    deleteAccount(id) {
      if (!state.accounts[id]) return false;
      delete state.accounts[id];
      if (state.activeId === id) state.activeId = null;
      save();
      return true;
    },

    hasAccounts() { return Object.keys(state.accounts).length > 0; },

    /* ---------- профиль активного аккаунта ---------- */
    setProfile(patch) {
      const a = active();
      if (!a) return;
      a.profile = Object.assign({}, a.profile, patch);
      save();
    },

    setSetting(key, value) {
      state.settings[key] = value;
      save();
    },

    getProgress(scenarioId) {
      const a = active();
      return (a && a.progress[scenarioId]) || null;
    },

    finishSession(scenarioId, { stars, correct, wrong }) {
      const a = active();
      if (!a) return;
      const prev = a.progress[scenarioId] || { stars: 0, attempts: 0 };
      a.progress[scenarioId] = {
        stars: Math.max(prev.stars || 0, stars),
        completed: true,
        attempts: (prev.attempts || 0) + 1,
        lastPlayed: Date.now(),
        lastCorrect: correct,
        lastWrong: wrong
      };
      a.stats.correct += correct;
      a.stats.wrong += wrong;
      save();
    },

    resetProgress() {
      const a = active();
      if (!a) return;
      a.progress = {};
      a.stats = clone(defaultStats);
      save();
    },

    resetAll() {
      state = newState();
      save();
    }
  };
})();
