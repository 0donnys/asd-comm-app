/* Приложение: регистрация, экраны, главная, настройки, финал */
window.App = (function () {
  const $ = (id) => document.getElementById(id);

  /* Инлайн-иконки из спрайта в index.html. */
  function iconHTML(name, cls) {
    return '<svg class="icon ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  }

  /* Три звезды: закрашенные — полученные, светлые — нет. */
  function starIcons(count) {
    let out = '';
    for (let i = 0; i < 3; i++) {
      out += '<svg class="star-icon ' + (i < count ? 'on' : 'off') + '" aria-hidden="true"><use href="#i-star"></use></svg>';
    }
    return out;
  }

  /* Показывать ли служебную строку про базу SQLite в настройках.
     По умолчанию скрыта, открывается «секретным» жестом — 5 нажатий
     на заголовок «Настройки» (нужно для проверки базы на защите). */
  let revealDb = false;

  /* Игры открываются по очереди: следующая доступна после прохождения предыдущей. */
  const SCENARIOS = [
    { id: 'shop', title: 'Магазин', sub: 'Сходим за продуктами', emoji: '🛒', thumbChar: 'girl' },
    { id: 'friend', title: 'Друг', sub: 'Готовим угощение для друга', emoji: '🧸', thumbChar: 'girl' },
    { id: 'playground', title: 'Площадка', sub: 'Собираемся и гуляем', emoji: '🛝', thumbChar: 'girl' },
    { id: 'school', title: 'Школа', sub: 'Собираемся и идём в школу', emoji: '🏫', thumbChar: 'girl' },
    /* Игры в разработке — пока недоступны */
    { id: 'clinic', title: 'Поликлиника', sub: 'Идём к врачу', emoji: '🏥', wip: true },
    { id: 'cafe', title: 'Кафе', sub: 'Заказываем еду', emoji: '🍽️', wip: true },
    { id: 'birthday', title: 'День рождения', sub: 'Поздравляем друга', emoji: '🎂', wip: true }
  ];

  /* Цепочка доступных игр (без тех, что в разработке) */
  function chain() {
    return SCENARIOS.filter(function (s) { return !s.wip; });
  }

  function prevOf(item) {
    const list = chain();
    const idx = list.indexOf(item);
    return idx > 0 ? list[idx - 1] : null;
  }

  /* Игра открыта, если пройдены все предыдущие игры цепочки */
  function isUnlocked(item) {
    if (item.wip) return false;
    const list = chain();
    const idx = list.indexOf(item);
    for (let i = 0; i < idx; i++) {
      const p = Store.getProgress(list[i].id);
      if (!p || !p.completed) return false;
    }
    return true;
  }

  const AVATARS = ['👧', '👦', '🦊', '🐻', '🐰', '🐱', '🦉', '🐸', '🌟', '🍄', '🍁', '🧸'];

  const reg = { step: 1, name: '', email: '', code: '', gender: 'girl', avatar: '👧' };

  function isBoy() {
    return Store.get().profile.gender === 'boy';
  }

  /* Персонаж сценария зависит от пола ребёнка */
  function charKey(key) {
    if (key === 'girl') return isBoy() ? 'boy' : 'girl';
    if (key === 'girlDressed') return isBoy() ? 'boyDressed' : 'girlDressed';
    return key;
  }

  /* ---------- экраны ---------- */
  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.remove('active');
    });
    const el = $('screen-' + name);
    if (el) el.classList.add('active');
  }

  /* ---------- регистрация ---------- */
  function generateCode() {
    reg.code = String(Math.floor(100000 + Math.random() * 900000));
    return reg.code;
  }

  function goRegStep(n) {
    reg.step = n;
    document.querySelectorAll('.reg-page').forEach(function (p) {
      p.hidden = Number(p.dataset.reg) !== n;
    });
    const label = $('reg-step');
    if (label) label.textContent = 'Шаг ' + n + ' из 5';
  }

  function showRegError(id, text) {
    const el = $(id);
    if (el) el.textContent = text || '';
  }

  function sendCode() {
    const name = $('reg-name').value.trim();
    const email = $('reg-email').value.trim();

    showRegError('reg-error', '');
    if (!name) {
      showRegError('reg-error', 'Введи имя ребёнка');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showRegError('reg-error', 'Проверь адрес почты');
      return;
    }

    reg.name = name;
    reg.email = email;
    generateCode();

    const show = $('reg-email-show');
    if (show) show.textContent = email;
    const codeEl = $('reg-demo-code');
    if (codeEl) codeEl.textContent = reg.code;

    $('reg-code').value = '';
    goRegStep(2);
    setTimeout(function () { $('reg-code').focus(); }, 50);
  }

  function verifyCode() {
    const entered = $('reg-code').value.replace(/\D/g, '');
    if (entered === reg.code) {
      showRegError('reg-code-error', '');
      goRegStep(3);
    } else {
      showRegError('reg-code-error', 'Код не подошёл. Попробуй ещё раз.');
    }
  }

  function renderAvatarOptions() {
    const box = $('reg-avatars');
    if (!box) return;
    box.innerHTML = '';
    AVATARS.forEach(function (emoji) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'avatar-opt' + (reg.avatar === emoji ? ' selected' : '');
      b.textContent = emoji;
      b.setAttribute('aria-label', 'Смайлик ' + emoji);
      b.addEventListener('click', function () {
        reg.avatar = emoji;
        box.querySelectorAll('.avatar-opt').forEach(function (x) {
          x.classList.toggle('selected', x === b);
        });
      });
      box.appendChild(b);
    });
  }

  function selectGender(gender) {
    /* если стоит стандартный смайлик пола — меняем его вместе с полом */
    const genderEmoji = reg.avatar === '👧' || reg.avatar === '👦' || !reg.avatar;
    reg.gender = gender;
    if (genderEmoji) reg.avatar = gender === 'boy' ? '👦' : '👧';
    document.querySelectorAll('.gender-card').forEach(function (c) {
      c.classList.toggle('selected', c.dataset.gender === gender);
    });
  }

  function initRegistration() {
    reg.name = '';
    reg.email = '';
    reg.gender = 'girl';
    reg.avatar = '👧';
    reg.code = '';

    $('reg-name').value = '';
    $('reg-email').value = '';
    $('reg-code').value = '';
    showRegError('reg-error', '');
    showRegError('reg-code-error', '');
    selectGender(reg.gender);
    renderAvatarOptions();
    goRegStep(1);
    showScreen('register');
  }

  function finishRegistration() {
    const name = reg.name || $('reg-name').value.trim();
    const profile = {
      name: name,
      email: reg.email,
      gender: reg.gender,
      avatar: reg.avatar,
      registered: true,
      verified: true
    };
    /* Если такой аккаунт уже есть — просто входим в него, не теряя прогресс */
    const existing = Store.findAccount(reg.email, name);
    if (existing) Store.setActive(existing);
    else Store.createAccount(profile);

    applySettings();
    renderHome();
    showScreen('home');
  }

  function showFinalRegPage() {
    const who = reg.gender === 'boy' ? 'мальчик' : 'девочка';
    const emoji = $('reg-finish-emoji');
    const title = $('reg-finish-title');
    const text = $('reg-finish-text');
    if (emoji) emoji.textContent = reg.avatar;
    if (title) title.textContent = reg.name;
    if (text) {
      text.textContent = 'Ты играешь как ' + who + '. Твой смайлик — ' + reg.avatar +
        '. Взрослый всегда рядом, если нужна помощь.';
    }
    goRegStep(5);
  }

  function bindRegistration() {
    $('reg-send').addEventListener('click', sendCode);
    $('reg-verify').addEventListener('click', verifyCode);
    $('reg-code').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
      showRegError('reg-code-error', '');
    });
    $('reg-code').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') verifyCode();
    });
    $('reg-resend').addEventListener('click', function () {
      generateCode();
      $('reg-demo-code').textContent = reg.code;
      $('reg-code').value = '';
      showRegError('reg-code-error', '');
    });
    $('reg-mail').addEventListener('click', function () {
      window.location.href = 'mailto:' + encodeURIComponent(reg.email) +
        '?subject=' + encodeURIComponent('Код для РАСигры') +
        '&body=' + encodeURIComponent('Здравствуйте! Ваш код: ' + reg.code);
    });
    document.querySelectorAll('.gender-card').forEach(function (c) {
      c.addEventListener('click', function () { selectGender(c.dataset.gender); });
    });
    $('reg-gender-next').addEventListener('click', function () {
      renderAvatarOptions();
      goRegStep(4);
    });
    $('reg-avatar-next').addEventListener('click', showFinalRegPage);
    $('reg-done').addEventListener('click', finishRegistration);
  }

  /* ---------- главная ---------- */
  let homeToastTimer = null;
  function homeToast(text) {
    const el = $('home-toast');
    if (!el || !text) return;
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(homeToastTimer);
    homeToastTimer = setTimeout(function () { el.classList.remove('show'); }, 2000);
  }

  function renderHome() {
    const state = Store.get();
    const name = state.profile.name || '';

    $('hello').textContent = name || 'Твои игры';

    const avatar = $('avatar');
    avatar.innerHTML = '';
    avatar.textContent = state.profile.avatar || (isBoy() ? '👦' : '👧');

    const list = $('scenario-list');
    list.innerHTML = '';

    SCENARIOS.forEach(function (item) {
      const progress = Store.getProgress(item.id);
      const stars = progress ? progress.stars || 0 : 0;
      const completed = !!(progress && progress.completed);
      const unlocked = isUnlocked(item);

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'scenario-card';
      if (item.wip) card.classList.add('soon');
      else if (!unlocked) card.classList.add('locked');
      else if (completed) card.classList.add('done');

      const thumb = document.createElement('div');
      thumb.className = 'scenario-thumb';
      thumb.innerHTML = '';

      const fallback = document.createElement('span');
      fallback.textContent = item.emoji;
      thumb.appendChild(fallback);

      if (item.thumbChar) {
        const key = charKey(item.thumbChar);
        const path = ASSETS.path('chars', key);
        if (path) {
          const img = document.createElement('img');
          img.src = path;
          img.alt = '';
          img.onerror = function () { img.remove(); };
          img.onload = function () { fallback.style.display = 'none'; };
          thumb.appendChild(img);
        }
      }

      const meta = document.createElement('div');
      meta.className = 'scenario-meta';

      const title = document.createElement('div');
      title.className = 'scenario-title';
      title.textContent = item.title;

      const sub = document.createElement('div');
      sub.className = 'scenario-sub';
      sub.textContent = item.sub;

      meta.appendChild(title);
      meta.appendChild(sub);

      if (!item.wip && unlocked && stars > 0) {
        const starsEl = document.createElement('div');
        starsEl.className = 'stars-row';
        starsEl.setAttribute('role', 'img');
        starsEl.setAttribute('aria-label', 'Звёзд: ' + stars + ' из 3');
        starsEl.innerHTML = starIcons(stars);
        meta.appendChild(starsEl);
      }

      if (!item.wip && !unlocked) {
        const prev = prevOf(item);
        const hint = document.createElement('div');
        hint.className = 'scenario-hint';
        hint.textContent = prev ? 'Откроется после «' + prev.title + '»' : 'Откроется позже';
        meta.appendChild(hint);
      }

      if (item.wip) {
        const badge = document.createElement('span');
        badge.className = 'scenario-badge soon';
        badge.textContent = 'В разработке';
        meta.appendChild(badge);
      } else if (!unlocked) {
        const badge = document.createElement('span');
        badge.className = 'scenario-badge lock';
        badge.innerHTML = iconHTML('lock', 'icon-badge') + '<span>Закрыто</span>';
        meta.appendChild(badge);
      } else if (completed) {
        const badge = document.createElement('span');
        badge.className = 'scenario-badge done';
        badge.innerHTML = iconHTML('check', 'icon-badge') + '<span>Пройдено</span>';
        meta.appendChild(badge);
      }

      card.appendChild(thumb);
      card.appendChild(meta);

      card.addEventListener('click', function () {
        AudioFX.prime();
        if (item.wip) {
          homeToast('Эта игра ещё в разработке');
          return;
        }
        if (!unlocked) {
          AudioFX.play('click');
          const prev = prevOf(item);
          homeToast('Сначала пройди «' + (prev ? prev.title : 'предыдущую игру') + '»');
          return;
        }
        AudioFX.play('click');
        Engine.start(window.SCENARIOS[item.id]);
      });

      list.appendChild(card);
    });
  }

  /* ---------- аккаунты ---------- */
  function renderAccounts() {
    const list = $('account-list');
    if (!list) return;
    list.innerHTML = '';

    const accounts = Store.listAccounts();
    if (!accounts.length) {
      const empty = document.createElement('p');
      empty.className = 'muted center';
      empty.textContent = 'Пока нет ни одного аккаунта.';
      list.appendChild(empty);
      return;
    }

    accounts.forEach(function (acc) {
      const p = acc.profile;
      const progress = acc.progress || {};
      let totalStars = 0;
      let doneCount = 0;
      Object.keys(progress).forEach(function (id) {
        const pr = progress[id] || {};
        totalStars += pr.stars || 0;
        if (pr.completed) doneCount++;
      });

      const card = document.createElement('div');
      card.className = 'account-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const av = document.createElement('span');
      av.className = 'account-avatar';
      av.setAttribute('aria-hidden', 'true');
      av.textContent = p.avatar || '👧';

      const meta = document.createElement('span');
      meta.className = 'account-meta';

      const nm = document.createElement('span');
      nm.className = 'account-name';
      nm.textContent = p.name || 'Без имени';

      const sub = document.createElement('span');
      sub.className = 'account-sub';
      sub.textContent = 'Игр: ' + doneCount + ' · Звёзд: ' + totalStars;

      meta.appendChild(nm);
      meta.appendChild(sub);

      const go = document.createElement('span');
      go.className = 'account-go';
      go.setAttribute('aria-hidden', 'true');
      go.innerHTML = iconHTML('play');

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'account-del';
      del.title = 'Удалить аккаунт';
      del.setAttribute('aria-label', 'Удалить аккаунт ' + (p.name || ''));
      del.innerHTML = iconHTML('trash');

      card.appendChild(av);
      card.appendChild(meta);
      card.appendChild(go);
      card.appendChild(del);

      function openAccount() {
        AudioFX.prime();
        AudioFX.play('click');
        Store.setActive(acc.id);
        applySettings();
        renderHome();
        showScreen('home');
      }

      card.addEventListener('click', openAccount);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAccount(); }
      });

      del.addEventListener('keydown', function (e) {
        e.stopPropagation();
      });

      del.addEventListener('click', function (e) {
        e.stopPropagation();
        AudioFX.play('click');
        askDelete(acc.id, p);
      });

      list.appendChild(card);
    });
  }

  function bindAccounts() {
    const add = $('btn-add-account');
    if (add) add.addEventListener('click', function () {
      AudioFX.play('click');
      initRegistration();
    });
  }

  /* ---------- подтверждение кодом из письма (выход / удаление аккаунта) ---------- */
  const verifyState = { code: '', action: null, accountId: null, email: '' };

  /* Что делать после выхода/удаления: показать аккаунты или регистрацию */
  function afterAuthChange() {
    applySettings();
    if (Store.hasAccounts()) {
      renderAccounts();
      showScreen('accounts');
    } else {
      initRegistration();
    }
  }

  function openVerify(opts) {
    verifyState.code = String(Math.floor(100000 + Math.random() * 900000));
    verifyState.action = opts.action;
    verifyState.accountId = opts.accountId || null;
    verifyState.email = opts.email || '';

    $('verify-title').textContent = opts.title || 'Подтверди действие';
    $('verify-email').textContent = opts.email || 'почту';
    $('verify-note').textContent = opts.note || '';
    $('verify-note').style.display = opts.note ? '' : 'none';
    $('verify-demo-code').textContent = verifyState.code;
    $('verify-code').value = '';
    showRegError('verify-error', '');

    const confirm = $('btn-verify-confirm');
    confirm.textContent = opts.confirmLabel || 'Подтвердить';
    confirm.classList.toggle('danger-solid', !!opts.danger);

    $('modal-settings').hidden = true;
    $('modal-verify').hidden = false;
    setTimeout(function () { $('verify-code').focus(); }, 50);
  }

  function verifyMailHref(email) {
    const what = verifyState.action === 'delete' ? 'Удаление аккаунта' : 'Выход из аккаунта';
    return 'mailto:' + encodeURIComponent(email || '') +
      '?subject=' + encodeURIComponent(what + ' — РАСигры') +
      '&body=' + encodeURIComponent('Код подтверждения: ' + verifyState.code);
  }

  function confirmVerify() {
    const entered = $('verify-code').value.replace(/\D/g, '');
    if (entered !== verifyState.code) {
      showRegError('verify-error', 'Код не подошёл. Попробуй ещё раз.');
      return;
    }
    const action = verifyState.action;
    const accountId = verifyState.accountId;
    $('modal-verify').hidden = true;

    if (action === 'delete') Store.deleteAccount(accountId);
    else Store.logout();

    afterAuthChange();
  }

  /* Удаление аккаунта — только после подтверждения кодом из письма */
  function askDelete(id, profile) {
    if (!id) return;
    const name = (profile && profile.name) || 'этот аккаунт';
    openVerify({
      action: 'delete',
      accountId: id,
      title: 'Удалить аккаунт?',
      confirmLabel: 'Удалить навсегда',
      email: profile && profile.email,
      note: 'Аккаунт «' + name + '» и весь его прогресс будут удалены безвозвратно.',
      danger: true
    });
  }

  function bindVerify() {
    $('btn-verify-cancel').addEventListener('click', function () {
      $('modal-verify').hidden = true;
    });
    $('btn-verify-confirm').addEventListener('click', confirmVerify);
    $('verify-code').addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
      showRegError('verify-error', '');
    });
    $('verify-code').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') confirmVerify();
    });
    $('verify-mail').addEventListener('click', function () {
      window.location.href = verifyMailHref(verifyState.email);
    });
  }

  function bindLogout() {
    $('btn-logout').addEventListener('click', function () {
      AudioFX.play('click');
      const p = Store.get().profile;
      openVerify({
        action: 'logout',
        title: 'Выйти из аккаунта',
        confirmLabel: 'Выйти',
        email: p.email,
        note: 'Чтобы ребёнок не выходил из аккаунта случайно, выход нужно подтвердить кодом.'
      });
    });
    $('btn-delete-account').addEventListener('click', function () {
      AudioFX.play('click');
      askDelete(Store.getActiveId(), Store.get().profile);
    });
  }

  /* ---------- настройки ---------- */
  function applySettings() {
    const s = Store.get().settings;
    const p = Store.get().profile;
    document.body.classList.toggle('hide-adult', !s.adult);
    document.body.classList.toggle('no-anim', !s.animations);

    $('set-sound').checked = s.sound;
    $('set-voice').checked = s.voice;
    $('set-adult').checked = s.adult;
    $('set-animations').checked = s.animations;

    const av = $('settings-avatar');
    const nm = $('settings-name');
    if (av) av.textContent = p.avatar || '👧';
    if (nm) nm.textContent = (p.name || 'Гость') + (p.email ? ' · ' + p.email : '');

    /* В Android-приложении готовим строку про базу SQLite, но показываем
       её только по «секретному» жесту — обычному пользователю она не нужна */
    const dbLine = $('db-line');
    if (dbLine) {
      const info = Store.dbInfo();
      if (info) {
        $('db-value').textContent = 'SQLite · аккаунтов: ' + info.accounts +
          ' · записей прогресса: ' + info.progress + ' · настроек: ' + info.settings;
      }
      dbLine.hidden = !revealDb;
    }

    /* Кнопку «Закрыть приложение» показываем только внутри Android-приложения */
    const exitBtn = $('btn-exit-app');
    if (exitBtn) exitBtn.hidden = !Store.canExitApp();
  }

  function bindSettings() {
    $('btn-settings').addEventListener('click', function () {
      applySettings();
      $('modal-settings').hidden = false;
      $('btn-settings-close').focus();
    });
    $('btn-settings-close').addEventListener('click', function () {
      $('modal-settings').hidden = true;
      $('btn-settings').focus();
    });

    /* Служебная строка про базу SQLite: 5 нажатий на заголовок «Настройки» */
    const title = $('settings-title');
    if (title) {
      let taps = 0;
      let tapTimer = null;
      title.addEventListener('click', function () {
        taps++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(function () { taps = 0; }, 1200);
        if (taps >= 5) {
          taps = 0;
          revealDb = !revealDb;
          const dbLine = $('db-line');
          if (dbLine) dbLine.hidden = !revealDb;
          AudioFX.play('ding');
        }
      });
    }

    /* Кнопка «Закрыть приложение» — только в Android-приложении */
    const exitBtn = $('btn-exit-app');
    if (exitBtn) {
      exitBtn.addEventListener('click', function () {
        AudioFX.play('click');
        Store.exitApp();
      });
    }

    $('set-sound').addEventListener('change', function (e) {
      Store.setSetting('sound', e.target.checked);
      AudioFX.play('click');
    });
    $('set-voice').addEventListener('change', function (e) {
      Store.setSetting('voice', e.target.checked);
      if (!e.target.checked) AudioFX.stopVoice();
    });
    $('set-adult').addEventListener('change', function (e) {
      Store.setSetting('adult', e.target.checked);
      document.body.classList.toggle('hide-adult', !e.target.checked);
    });
    $('set-animations').addEventListener('change', function (e) {
      Store.setSetting('animations', e.target.checked);
      document.body.classList.toggle('no-anim', !e.target.checked);
    });

    $('btn-reset').addEventListener('click', function () {
      if (confirm('Сбросить весь прогресс? Это нельзя отменить.')) {
        Store.resetProgress();
        renderHome();
        $('modal-settings').hidden = true;
        $('btn-settings').focus();
      }
    });

    $('btn-adult-min').addEventListener('click', function () {
      $('adult-panel').classList.toggle('minimized');
    });
  }

  /* ---------- пауза / назад ---------- */
  function bindPause() {
    function open() {
      Engine.pause();
      $('modal-pause').hidden = false;
      $('btn-pause-continue').focus();
    }
    $('btn-pause').addEventListener('click', open);
    $('btn-back').addEventListener('click', open);
    $('btn-pause-continue').addEventListener('click', function () {
      $('modal-pause').hidden = true;
      Engine.resume();
      $('btn-pause').focus();
    });
    $('btn-pause-home').addEventListener('click', function () {
      $('modal-pause').hidden = true;
      Engine.abort();
      renderHome();
      showScreen('home');
    });
  }

  /* ---------- финал ---------- */
  function showFinale(result) {
    const sc = result.scenario;
    Store.finishSession(sc.id, {
      stars: result.stars,
      correct: result.correct,
      wrong: result.wrong
    });

    showScreen('finale');
    const title = $('finale-title');
    if (title) title.textContent = isBoy() ? 'Ты справился' : 'Ты справилась';
    const verb = isBoy() ? 'прошёл' : 'прошла';
    $('finale-text').textContent =
      'Ты ' + verb + ' игру «' + sc.title + '». Правильных ответов: ' + result.correct +
      ', ошибок: ' + result.wrong + '.';

    const finaleChar = $('finale-char');
    if (finaleChar) {
      const path = ASSETS.path('chars', charKey('girl'));
      if (path) finaleChar.src = path;
    }

    const starsBox = $('finale-stars');
    starsBox.innerHTML = starIcons(result.stars);
    starsBox.setAttribute('aria-label', 'Звёзд: ' + result.stars + ' из 3');

    $('btn-again').onclick = function () {
      Engine.start(window.SCENARIOS[sc.id]);
    };
    $('btn-home').onclick = function () {
      Engine.abort();
      renderHome();
      showScreen('home');
    };
  }

  /* ---------- старт ---------- */
  function init() {
    applySettings();
    bindSettings();
    bindPause();
    bindRegistration();
    bindAccounts();
    bindVerify();
    bindLogout();

    if (Store.getActiveId()) {
      renderHome();
      showScreen('home');
    } else if (Store.hasAccounts()) {
      renderAccounts();
      showScreen('accounts');
    } else {
      initRegistration();
    }

    document.addEventListener('pointerdown', function () { AudioFX.prime(); }, { once: true });

    /* офлайн-режим (только в браузере: в приложении файлы уже внутри APK) */
    if (!Store.isNative() && 'serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  /* ---------- кнопка «Назад» на телефоне ---------- */
  /* Возвращаем true, если приложение само обработало нажатие.
     false — значит нажатие нужно передать системе (выход из приложения). */
  function androidBack() {
    /* пауза: закрываем окно и продолжаем игру */
    const pauseModal = $('modal-pause');
    if (pauseModal && !pauseModal.hidden) {
      pauseModal.hidden = true;
      Engine.resume();
      return true;
    }

    /* любое другое открытое окно просто закрываем */
    const openModal = document.querySelector('.modal:not([hidden])');
    if (openModal) { openModal.hidden = true; return true; }

    const current = document.querySelector('.screen.active');
    const name = current ? current.id.replace('screen-', '') : '';

    if (name === 'game') {
      Engine.pause();
      $('modal-pause').hidden = false;
      return true;
    }
    if (name === 'finale') {
      Engine.abort();
      renderHome();
      showScreen('home');
      return true;
    }
    if (name === 'register') {
      if (reg.step > 1) { goRegStep(reg.step - 1); return true; }
      if (Store.hasAccounts()) { renderAccounts(); showScreen('accounts'); return true; }
      return false;
    }
    return false;
  }

  window.androidBack = androidBack;

  document.addEventListener('DOMContentLoaded', init);

  return { showScreen, renderHome, renderAccounts, showFinale, initRegistration, charKey, androidBack };
})();
