/* Движок сценариев: шаги, варианты, подсказки, перетаскивание */
window.Engine = (function () {
  let sc = null;
  let idx = 0;
  let stats = { correct: 0, wrong: 0 };
  let picked = [];
  let busy = false;
  let selectedDrag = null;
  let labels = {};
  let doneCount = 0;
  let dragTargetWord = 'корзинку';
  let activeGhost = null;
  let activeDragEl = null;

  function overTarget(x, y, r) {
    var pad = 22;
    return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
  }

  function removeDragGhosts() {
    document.querySelectorAll('.drag-ghost').forEach(function (g) { g.remove(); });
    if (activeDragEl) activeDragEl.style.opacity = '';
    activeGhost = null;
    activeDragEl = null;
  }

  /* Если палец отпустили вне элемента, событие pointerup могло не дойти. */
  document.addEventListener('pointerup', function () {
    setTimeout(function () { if (!activeGhost) removeDragGhosts(); }, 260);
  }, true);
  document.addEventListener('pointercancel', function () {
    setTimeout(function () { if (!activeGhost) removeDragGhosts(); }, 260);
  }, true);

  const $ = (id) => document.getElementById(id);

  function isBoy() { return Store.get().profile.gender === 'boy'; }

  /* Реплика с учётом пола ребёнка: «оделась» → «оделся» и т.п. */
  function voiceFor(v) {
    if (v && isBoy() && v.boyText) {
      return { id: v.boyId || (v.id + '.boy'), text: v.boyText };
    }
    return v;
  }

  function doneTextFor(st) {
    return isBoy() && st.boyDoneText ? st.boyDoneText : st.doneText;
  }

  function adultFor(st) {
    return isBoy() && st.boyAdult ? st.boyAdult : st.adult;
  }

  /* ---------- запуск ---------- */
  function buildLabels() {
    labels = {};
    if (!sc) return;
    sc.steps.forEach(function (s, i) { if (s.id) labels[s.id] = i; });
  }

  function start(scenario) {
    sc = scenario;
    idx = 0;
    stats = { correct: 0, wrong: 0 };
    picked = [];
    busy = false;
    selectedDrag = null;
    doneCount = 0;
    buildLabels();
    App.showScreen('game');
    const panel = $('adult-panel');
    if (panel) panel.classList.remove('minimized');
    enterStep();
  }

  function abort() {
    sc = null;
    busy = false;
    removeDragGhosts();
    AudioFX.stopVoice();
  }

  /* ---------- шаг ---------- */
  function current() { return sc ? sc.steps[idx] : null; }

  function enterStep() {
    const st = current();
    if (!st) return;
    picked = [];
    busy = false;
    selectedDrag = null;

    removeDragGhosts();

    const staleToast = $('toast');
    if (staleToast) staleToast.classList.remove('show');

    updateProgress();
    renderScene(st);
    const bubble = voiceFor(st.bubble);
    setBubble(bubble, st.speaker);
    setAdult(adultFor(st));
    renderOptions(st);

    if (bubble) AudioFX.say(bubble.id, bubble.text);
  }

  function updateProgress() {
    const fill = $('progress-fill');
    if (!fill || !sc) return;
    const total = Math.max(1, sc.totalSteps || sc.steps.length);
    const pct = Math.max(0, Math.min(100, (doneCount / total) * 100));
    fill.style.transform = 'scaleX(' + (pct / 100) + ')';
    const wrap = $('progress-wrap');
    if (wrap) {
      wrap.setAttribute('aria-valuenow', String(Math.round(pct)));
      wrap.setAttribute('aria-valuetext', Math.round(pct) + '%');
    }
  }

  /* ---------- сцена ---------- */
  function renderScene(st) {
    const scene = $('scene');
    scene.innerHTML = '';
    scene.classList.toggle('two-chars', !!(st.char && st.char2));

    const sInfo = ASSETS.scenes[st.scene] || { emoji: '🏠' };
    const fallback = document.createElement('div');
    fallback.className = 'scene-fallback';
    fallback.textContent = sInfo.emoji;
    scene.appendChild(fallback);

    const bg = document.createElement('img');
    bg.className = 'scene-img';
    bg.alt = '';
    bg.src = ASSETS.path('scenes', st.scene);
    bg.onload = function () { fallback.style.display = 'none'; };
    bg.onerror = function () { bg.remove(); };
    scene.appendChild(bg);

    function addChar(key, right) {
      const finalKey = App.charKey ? App.charKey(key) : key;
      const info = ASSETS.info('chars', finalKey);
      const adult = finalKey === 'cashier' || finalKey === 'mom' || finalKey === 'teacher';

      /* эмодзи — только запасной вариант, поэтому скрыт, пока картинка
         не загрузилась; иначе видно и картинку, и эмодзи («дублирование») */
      const emoji = document.createElement('div');
      emoji.className = 'scene-char-emoji' + (right ? ' right' : '') + (adult ? ' is-adult' : '');
      emoji.textContent = info.emoji || '🧒';
      emoji.style.display = 'none';
      scene.appendChild(emoji);

      const img = document.createElement('img');
      img.className = 'scene-char' + (right ? ' right' : '') + (adult ? ' is-adult' : '');
      img.alt = '';
      img.src = ASSETS.path('chars', finalKey);
      img.onerror = function () { img.remove(); emoji.style.display = 'grid'; };
      scene.appendChild(img);
    }

    if (st.char) addChar(st.char, false);
    if (st.char2) addChar(st.char2, true);
  }

  /* ---------- реплики ---------- */
  function setBubble(v, speaker) {
    const el = $('bubble');
    if (!el) return;
    el.innerHTML = '';
    if (speaker) {
      const sp = document.createElement('span');
      sp.className = 'speaker';
      sp.textContent = speaker;
      el.appendChild(sp);
    }
    const t = document.createElement('span');
    t.textContent = v ? v.text : '';
    el.appendChild(t);
  }

  function setAdult(text) {
    const el = $('adult-text');
    if (el) el.textContent = text || '';
  }

  let toastTimer = null;
  function toast(text) {
    const el = $('toast');
    if (!el || !text) return;
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }

  /* ---------- варианты ---------- */
  function renderOptions(st) {
    const box = $('options');
    box.innerHTML = '';
    box.className = 'options';

    if (st.type === 'info') {
      const b = document.createElement('button');
      b.className = 'btn primary';
      b.textContent = st.nextLabel || 'Дальше';
      b.addEventListener('click', function () {
        if (busy) return;
        AudioFX.prime();
        AudioFX.play('click');
        completeStep();
      });
      box.appendChild(b);
      return;
    }

    if (st.type === 'drag') {
      renderDrag(st, box);
      return;
    }

    const count = st.options.length;
    const cols = st.cols || (count <= 2 ? 2 : count === 3 ? 3 : 3);
    box.classList.add('cols-' + Math.min(4, cols));
    if (st.shelf) box.classList.add('is-shelf');

    st.options.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.className = 'option-card';
      btn.dataset.id = opt.id;
      btn.type = 'button';

      const info = ASSETS.info(opt.group || 'items', opt.id);
      const img = document.createElement('img');
      img.className = 'option-img';
      img.alt = '';
      img.src = ASSETS.path(opt.group || 'items', opt.id);

      const emoji = document.createElement('span');
      emoji.className = 'option-emoji';
      emoji.textContent = info.emoji;
      emoji.style.display = 'none';

      img.onerror = function () {
        img.style.display = 'none';
        emoji.style.display = 'grid';
      };

      const label = document.createElement('span');
      label.className = 'option-label';
      label.textContent = opt.label || info.label;

      const tick = document.createElement('span');
      tick.className = 'tick';
      tick.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg>';

      btn.appendChild(img);
      btn.appendChild(emoji);
      btn.appendChild(label);
      btn.appendChild(tick);

      btn.addEventListener('click', function () { onPick(st, opt, btn); });
      box.appendChild(btn);
    });
  }

  function remaining(st) {
    return st.correct.filter(function (id) { return picked.indexOf(id) === -1; });
  }

  function onPick(st, opt, btn) {
    if (busy) return;
    /* уже выбранный правильный вариант не считается ошибкой */
    if (picked.indexOf(opt.id) !== -1) return;
    AudioFX.prime();

    const need = remaining(st);

    if (need.indexOf(opt.id) !== -1) {
      busy = true;
      picked.push(opt.id);
      stats.correct++;

      btn.classList.add('correct', 'used');
      AudioFX.play('ding');
      const voice = voiceFor(st.sayCorrect && st.sayCorrect[opt.id]);
      if (voice) setTimeout(function () { AudioFX.say(voice.id, voice.text); }, 120);

      setTimeout(function () {
        busy = false;
        if (remaining(st).length === 0 || st.single) {
          completeStep();
        } else {
          advancePrompt(st);
        }
      }, 750);
      return;
    }

    /* ошибка — мягко, без перехода; повторный тап по той же кнопке не считается */
    if (btn.classList.contains('wrong')) return;
    stats.wrong++;
    AudioFX.play('bip');
    btn.classList.add('wrong');
    setTimeout(function () { btn.classList.remove('wrong'); }, 500);

    const nextNeed = need[0];
    const hint = (st.hints && st.hints[nextNeed]) || st.hint;
    if (hint) {
      AudioFX.say(hint.id, hint.text);
      toast(hint.text);
    }
  }

  function advancePrompt(st) {
    const next = remaining(st)[0];
    if (!next) return;

    if (st.bubbleByPending && st.bubbleByPending[next]) {
      const b = voiceFor(st.bubbleByPending[next]);
      setBubble(b);
      AudioFX.say(b.id, b.text);
    }
    if (st.adultByPending && st.adultByPending[next]) {
      setAdult(st.adultByPending[next]);
    }
  }

  /* ---------- перетаскивание ---------- */
  function renderDrag(st, box) {
    box.classList.add('cols-1');

    dragTargetWord = (ASSETS.info('items', st.target).label || 'корзинку');

    const wrap = document.createElement('div');
    wrap.className = 'drag-wrap';

    const itemsBox = document.createElement('div');
    itemsBox.className = 'drag-items';

    const target = document.createElement('div');
    target.className = 'drop-target';

    const tInfo = ASSETS.info('items', st.target);
    const tImg = document.createElement('img');
    tImg.alt = '';
    tImg.src = ASSETS.path('items', st.target);
    tImg.onerror = function () {
      tImg.remove();
      target.insertAdjacentText('afterbegin', tInfo.emoji);
    };
    target.appendChild(tImg);

    const counter = document.createElement('span');
    counter.className = 'drop-count';
    counter.textContent = '0/' + st.items.length;
    target.appendChild(counter);

    st.items.forEach(function (id) {
      const info = ASSETS.info('items', id);
      const el = document.createElement('div');
      el.className = 'drag-item';
      el.dataset.id = id;

      const img = document.createElement('img');
      img.alt = '';
      img.src = ASSETS.path('items', id);
      img.onerror = function () {
        img.remove();
        el.insertAdjacentText('afterbegin', info.emoji);
      };
      el.appendChild(img);
      el.title = info.label;

      makeDraggable(el, st, target, counter);
      itemsBox.appendChild(el);
    });

    target.addEventListener('click', function () {
      if (!selectedDrag) return;
      acceptDrop(st, selectedDrag.dataset.id, selectedDrag, target, counter);
      selectedDrag = null;
    });

    wrap.appendChild(itemsBox);
    wrap.appendChild(target);
    box.appendChild(wrap);

    const hint = document.createElement('p');
    hint.className = 'drag-hint';
    hint.textContent = st.dragHint || 'Перетащи предметы в рамку (или нажми на предмет, потом на рамку)';
    box.appendChild(hint);
  }

  function makeDraggable(el, st, target, counter) {
    let startX = 0, startY = 0, ghost = null, moved = false;

    el.addEventListener('pointerdown', function (e) {
      if (busy || ghost) return;
      e.preventDefault();
      AudioFX.prime();
      removeDragGhosts();
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      startX = e.clientX;
      startY = e.clientY;
      moved = false;

      const r = el.getBoundingClientRect();
      ghost = el.cloneNode(true);
      ghost.classList.add('drag-ghost');
      ghost.style.position = 'fixed';
      ghost.style.left = r.left + 'px';
      ghost.style.top = r.top + 'px';
      ghost.style.width = r.width + 'px';
      ghost.style.height = r.height + 'px';
      ghost.style.margin = '0';
      ghost.style.zIndex = '999';
      ghost.style.pointerEvents = 'none';
      ghost.style.opacity = '.95';
      ghost.style.transform = 'translate(0,0)';
      document.body.appendChild(ghost);
      activeGhost = ghost;
      activeDragEl = el;
      el.style.opacity = '.25';
    });

    el.addEventListener('pointermove', function (e) {
      if (!ghost) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
      ghost.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';

      const r = target.getBoundingClientRect();
      const over = overTarget(e.clientX, e.clientY, r);
      target.classList.toggle('hover', over);
    });

    el.addEventListener('pointerup', function (e) {
      if (!ghost) return;
      const g = ghost;
      ghost = null;
      activeGhost = null;

      const r = target.getBoundingClientRect();
      const over = overTarget(e.clientX, e.clientY, r);
      target.classList.remove('hover');

      if (over) {
        g.remove();
        activeDragEl = null;
        el.style.opacity = '';
        acceptDrop(st, el.dataset.id, el, target, counter);
        return;
      }

      if (!moved) {
        /* Это был тап, а не перетаскивание: просто выбираем предмет. */
        g.remove();
        activeDragEl = null;
        el.style.opacity = '';
        if (selectedDrag === el) {
          el.classList.remove('selected');
          selectedDrag = null;
        } else {
          if (selectedDrag) selectedDrag.classList.remove('selected');
          selectedDrag = el;
          el.classList.add('selected');
          toast('Теперь нажми на ' + dragTargetWord);
        }
        return;
      }

      /* Не попал в цель — возвращаем предмет на исходное место. */
      g.style.transition = 'transform .18s cubic-bezier(.22,1,.36,1), opacity .18s ease';
      g.style.transform = 'translate(0,0)';
      g.style.opacity = '0';
      setTimeout(function () {
        g.remove();
        el.style.opacity = '';
        activeDragEl = null;
      }, 190);
    });

    el.addEventListener('pointercancel', function () {
      if (ghost) { ghost.remove(); ghost = null; }
      activeGhost = null;
      activeDragEl = null;
      el.style.opacity = '';
      target.classList.remove('hover');
    });
  }

  function acceptDrop(st, id, el, target, counter) {
    if (busy) return;
    if (picked.indexOf(id) !== -1) return;

    picked.push(id);
    stats.correct++;
    AudioFX.play('ding');
    el.classList.add('gone');
    const info = ASSETS.info('items', id);
    toast('Готово: ' + info.label);
    counter.textContent = picked.length + '/' + st.items.length;

    const voice = voiceFor(st.sayCorrect && st.sayCorrect[id]);
    if (voice) AudioFX.say(voice.id, voice.text);

    if (selectedDrag === el) {
      el.classList.remove('selected');
      selectedDrag = null;
    }

    if (picked.length === st.items.length) {
      setTimeout(function () { completeStep(); }, 550);
    }
  }

  /* ---------- завершение шага ---------- */
  function resolveNext(st) {
    /* ветвление: выбор варианта может вести на свой шаг */
    if (st.branch && picked.length === 1 && st.branch[picked[0]] != null) {
      const t = labels[st.branch[picked[0]]];
      if (t != null) return t;
    }
    /* явный переход по метке */
    if (st.next) {
      const t = labels[st.next];
      if (t != null) return t;
    }
    return idx + 1;
  }

  function completeStep() {
    const st = current();
    if (!st || busy) return;
    busy = true;

    const complete = voiceFor(st.completeVoice);
    if (complete) {
      AudioFX.say(complete.id, complete.text);
    } else {
      AudioFX.play('ding');
    }
    const done = doneTextFor(st);
    if (done) {
      setBubble({ text: done });
      toast(done);
    }

    setTimeout(function () {
      busy = false;
      if (st.final) {
        finish();
      } else {
        doneCount++;
        idx = resolveNext(st);
        enterStep();
      }
    }, 1250);
  }

  function finish() {
    const total = stats.correct + stats.wrong;
    const acc = total > 0 ? stats.correct / total : 1;
    const stars = acc >= 0.85 ? 3 : acc >= 0.6 ? 2 : 1;
    AudioFX.play('win');
    App.showFinale({ scenario: sc, stars: stars, correct: stats.correct, wrong: stats.wrong });
  }

  /* ---------- пауза ---------- */
  function pause() {
    AudioFX.stopVoice();
  }

  function resume() {
    const st = current();
    if (!st) return;
    const b = voiceFor(st.bubble);
    if (b) AudioFX.say(b.id, b.text);
  }

  return { start, abort, pause, resume };
})();
