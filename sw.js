/* Офлайн-кеш приложения */
const CACHE = 'asd-comm-v21';
const CORE = [
  './',
  'index.html',
  'css/styles.css',
  'js/store.js',
  'js/audio.js',
  'js/assets.js',
  'js/engine.js',
  'js/app.js',
  'data/scenarios/shop.js',
  'data/scenarios/friend.js',
  'data/scenarios/playground.js',
  'data/scenarios/school.js',
  'data/voices.json',
  'manifest.webmanifest',
  'assets/assets-manifest.json',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-512-maskable.png'
];

/* Список всех картинок и звуков лежит в assets/assets-manifest.json.
   Кешируем их заранее, чтобы приложение работало офлайн сразу после установки. */
function precacheAssets(cache) {
  return fetch('assets/assets-manifest.json', { cache: 'no-cache' })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (!data || !data.files || !data.files.length) return;
      var files = data.files;
      var step = 40;
      var i = 0;
      function batch() {
        if (i >= files.length) return Promise.resolve();
        var part = files.slice(i, i + step);
        i += step;
        return Promise.all(part.map(function (url) {
          return cache.add(url).catch(function () { /* файла может не быть — не страшно */ });
        })).then(batch);
      }
      return batch();
    })
    .catch(function () { /* офлайн при первой установке — не критично */ });
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(CORE.map(function (url) {
        return cache.add(url).catch(function () { /* файла может ещё не быть */ });
      })).then(function () { return precacheAssets(cache); });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isMedia = /\.(png|jpe?g|webp|svg|m4a|mp3|woff2?)$/i.test(url.pathname);

  /* Кладём в кеш только успешные ответы: иначе «404» на ещё не готовый файл
     (например, озвучку) застревает в кеше и больше никогда не обновляется. */
  function put(req, res) {
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
    }
    return res;
  }

  /* Отдаём из кеша, если он есть и он успешный.
     Для переходов между страницами запасной вариант — index.html (SPA-фолбэк). */
  function fromCache(req) {
    return caches.match(req).then(function (hit) {
      if (hit && hit.ok) return hit;
      return req.mode === 'navigate' ? caches.match('index.html') : null;
    });
  }

  if (isMedia) {
    event.respondWith(
      fromCache(req).then(function (hit) {
        if (hit) return hit;
        /* no-cache: перепроверяем свежесть у сервера, чтобы обновления картинок/звука
           доходили до пользователя, а не брались из старого HTTP-кэша */
        return fetch(req, { cache: 'no-cache' }).then(function (res) { return put(req, res); })
          .catch(function () { return caches.match(req); });
      })
    );
    return;
  }

  /* Оболочка приложения: сначала сеть, но при ошибке ИЛИ плохом ответе
     (например, 502 от прокси, когда сервер недоступен) — отдаём кеш,
     чтобы приложение работало офлайн. */
  event.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) return put(req, res);
      return fromCache(req).then(function (hit) { return hit || res; });
    }).catch(function () {
      return fromCache(req).then(function (hit) {
        if (hit) return hit;
        throw new Error('offline and not cached: ' + req.url);
      });
    })
  );
});
