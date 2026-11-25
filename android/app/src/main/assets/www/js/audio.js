/* Мягкие звуки (WebAudio) + озвучка реплик (готовые файлы с фолбэком на TTS) */
window.AudioFX = (function () {
  let ctx = null;
  let currentVoice = null;
  let primed = false;

  function isSoundOn() { return Store.get().settings.sound; }
  function isVoiceOn() { return Store.get().settings.voice; }

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function prime() {
    if (primed) return;
    const c = getCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    // «разбудить» аудио на мобильных после касания
    const b = c.createBuffer(1, 1, 22050);
    const s = c.createBufferSource();
    s.buffer = b;
    s.connect(c.destination);
    s.start(0);
    primed = true;
  }

  function tone(freq, start, duration, gainValue, type) {
    const c = getCtx();
    if (!c) return;
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainValue, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  function noise(start, duration, gainValue) {
    const c = getCtx();
    if (!c) return;
    const t0 = c.currentTime + start;
    const frames = Math.floor(c.sampleRate * duration);
    const buffer = c.createBuffer(1, frames, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    }
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    const gain = c.createGain();
    gain.gain.setValueAtTime(gainValue, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    src.connect(filter).connect(gain).connect(c.destination);
    src.start(t0);
    src.stop(t0 + duration);
  }

  const sfx = {
    ding() { tone(880, 0, 0.22, 0.14, 'sine'); tone(1320, 0.09, 0.28, 0.10, 'sine'); },
    bip() { tone(330, 0, 0.16, 0.10, 'sine'); tone(300, 0.09, 0.14, 0.07, 'sine'); },
    swish() { noise(0, 0.22, 0.07); },
    click() { tone(600, 0, 0.06, 0.06, 'sine'); },
    win() { tone(523, 0, 0.2, 0.10); tone(659, 0.12, 0.2, 0.10); tone(784, 0.24, 0.2, 0.10); tone(1046, 0.36, 0.4, 0.09); }
  };

  function play(name) {
    if (!isSoundOn()) return;
    prime();
    const fn = sfx[name];
    if (fn) { try { fn(); } catch (e) { /* без звука */ } }
  }

  function stopVoice() {
    if (currentVoice) {
      try { currentVoice.pause(); } catch (e) {}
      currentVoice = null;
    }
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  function speakText(text) {
    if (!text || !window.speechSynthesis) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ru-RU';
      u.rate = 0.9;
      u.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const ru = voices.find(v => /ru/i.test(v.lang));
      if (ru) u.voice = ru;
      window.speechSynthesis.speak(u);
    } catch (e) { /* без озвучки */ }
  }

  /**
   * Проигрывает готовую реплику из assets/audio/<id>.mp3.
   * Если файла нет — читает text через TTS браузера.
   */
  function say(id, text) {
    if (!isVoiceOn()) return;
    stopVoice();
    if (!id) { speakText(text); return; }

    const audio = new Audio('assets/audio/' + id + '.mp3');
    currentVoice = audio;
    audio.volume = 1;
    audio.play().catch(function () {
      speakText(text);
    });
    audio.onerror = function () { speakText(text); };
  }

  return { prime, play, say, stopVoice, speakText };
})();
