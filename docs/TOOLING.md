# Инструменты под проект «РАСигры»: скиллы и MCP

> Подборка под реальные задачи проекта, а не «топ-10 вообще»: офлайн-PWA,
> Android WebView + SQLite, детская доступность, русские тексты, проверка
> четырёх длинных сценариев. Ссылки и звёзды — на 19.11.2026.

## 1. Что именно нужно проверять и улучшать

| Задача проекта | Чем закрывать |
|---|---|
| Вёрстка и визуальный язык | `unslop` (уже стоит) + `web-design-guidelines` |
| Доступность для детей и взрослых | `accessibility-lead` / `web-accessibility-wizard` + a11y MCP |
| Регрессии 4 сценариев, регистрация, аккаунты | Playwright-скилл + Playwright MCP |
| Поведение APK, кнопка «Назад», офлайн, WebView | Mobile MCP (adb) + Chrome DevTools MCP |
| PWA, офлайн-кеш, установка, производительность | Lighthouse MCP |
| Русские тексты без «ИИ-канцелярита» | `humanizer-ru` |
| Kotlin/Gradle/WebView-обвязка | `claude-android-ninja` (частично) |
| Свежие доки AndroidX/PWA | Context7 MCP |

## 2. Скиллы

### Ставить сразу

| Скилл | Репозиторий | Что даёт | Ограничение |
|---|---|---|---|
| **unslop** | [heydamir/unslop](https://github.com/heydamir/unslop) | Аудит «ИИ-вида», направление, 9 проходов | Уже установлен в `.dsh/skills/unslop` |
| **web-design-guidelines** | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | Проверка UI по Web Interface Guidelines, вывод `file:line` | Тянет guidelines из сети при каждом прогоне |
| **accessibility-lead** | [Community-Access/accessibility-agents](https://github.com/Community-Access/accessibility-agents) | WCAG 2.2 AA: роли, фокус, клавиатура, контраст, скринридер | Плагин целиком тяжёлый; для DSH копируй только каталог скилла |
| **humanizer-ru** | [smixs/humanizer-ru](https://github.com/smixs/humanizer-ru) | 38 признаков AI-текста, линтер на Python, не трогает факты | Заточен под взрослые тексты; в детских репликах применять точечно |
| **playwright-skill** | [lackeyjb/playwright-skill](https://github.com/lackeyjb/playwright-skill) | Агент пишет и запускает Playwright-сценарии, скриншоты, видео | Нужен Node 20+ и `npm run setup` |
| **frontend-design** | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Вкус, типографика, «не как шаблон» для новых экранов | Конфликтует с unslop по вкусу; брать для новых экранов, не для текущей полировки |

### Можно позже

| Скилл | Зачем |
|---|---|
| [claude-android-ninja](https://github.com/Drjacky/claude-android-ninja) | Gradle, манифест, ресурсы. Но он про Compose, а тут WebView — польза частичная |
| [ux-audit-skill](https://github.com/malkreide/ux-audit-skill) | Повторяемый UX-аудит по Нильсену + WCAG + Core Web Vitals |
| [design-auditor](https://github.com/Ashutos1997/claude-design-auditor-skill) | 19 правил дизайна, быстрый второй взгляд |
| [ui-ux-agent-skills](https://github.com/plugin87/ux-ui-agent-skills) | Дизайн-токены, WCAG 2.2, компонентные правила |

### Как ставить в DSH

Скилл — это папка с `SKILL.md` (или плоский `<name>.md`) в одном из корней:

- проект: `<проект>/.dsh/skills/<name>/` (уже используется для `unslop`);
- пользователь: `~/.dsh/skills/<name>/`;
- совместимый: `~/.agents/skills/<name>/`.

```bash
git clone --depth 1 https://github.com/<owner>/<repo>.git /tmp/skill-src
mkdir -p .dsh/skills/<name>
cp -R /tmp/skill-src/<путь-до-скилла>/. .dsh/skills/<name>/
```

Каталог обновляется вотчером, перезапуск не нужен. Если скилл ставится
через `npx skills add`, сначала нужен Node/npm — на этой машине их нет в `PATH`.

## 3. MCP-серверы

| MCP | Репозиторий | Роль в проекте | Цена/риск |
|---|---|---|---|
| **Playwright MCP** | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) | Прогон регистрации и 4 сценариев, скриншоты 390×844, мобильная эмуляция | Бесплатно, Node 20+, тянет браузер |
| **Chrome DevTools MCP** | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Консоль, сеть, производительность, проверка PWA/офлайна | Бесплатно; по умолчанию шлёт анонимную статистику Google, отключается флагом |
| **Mobile MCP** | [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp) | APK в эмуляторе/на телефоне: установка, тапы, «Назад», скриншоты | Бесплатно; нужен adb/эмулятор |
| **Lighthouse MCP** | [priyankark/lighthouse-mcp](https://github.com/priyankark/lighthouse-mcp) | PWA, офлайн, performance, accessibility score | Бесплатно, Node |
| **a11y-mcp** | [priyankark/a11y-mcp](https://github.com/priyankark/a11y-mcp) | axe-core: контраст, роли, alt, клавиатура | Бесплатно; не заменяет ручную проверку скринридером |
| **Context7** | [upstash/context7](https://github.com/upstash/context7) | Свежие доки WebViewAssetLoader, WebViewClientCompat, PWA | Бесплатно, ключ для лимитов |
| **GitHub MCP** | [github/github-mcp-server](https://github.com/github/github-mcp-server) | Репозиторий, issues, CI, релизы APK | Нужен PAT/OAuth; смысл появится после `git init` |
| **SQLite MCP** | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite) | Разговорные запросы к `asd_comm.db` после `adb pull` | Легче просто `sqlite3`; MCP — если хочется диалога |

### Не рекомендую сейчас

- **axe MCP от Deque** — официальный, но требует Docker и платную подписку
  Axe DevTools. Для этого проекта хватит бесплатного `a11y-mcp`.
- **Figma MCP** — в проекте нет макетов Figma, только код и SVG.
- **Тяжёлые «39 skills / 33 tools» наборы** — шум в контексте, проекту нужно
  4–6 инструментов, а не платформа.
- **MCP для генерации картинок** — иллюстрации уже оригинальные SVG,
  генерировать нечего.

### Как это ставится в DSH

MCP в DSH — это configuration-only bundle: `package.json` с `dsh.bundle.patch`
и патч, который вставляет `@deepseek-ai/dsh-mcp-client`. Для stdio-сервера:

```yaml
- id: mcp-playwright
  name: "@deepseek-ai/dsh-mcp-client"
  config:
    serverName: playwright
    transport: stdio
    command: npx
    args: ["-y", "@playwright/mcp@latest"]
    failOnStartupError: true
```

Для HTTP (например, Context7) — `transport: streamable-http` и `url`.
После установки появляются инструменты `mcp__playwright__*`; проверять
через любой безобидный вызов.

**Важно:** на этой машине `node`, `npm`, `npx` не найдены в `PATH`. Пока их нет,
ни Playwright MCP, ни Chrome DevTools MCP, ни Context7 не запустятся.
Первый шаг — `brew install node` (Node 22 LTS) либо запуск серверов
через контейнер/удалённый endpoint.

## 4. Рекомендуемый набор

### Минимум (быстро и по делу)

1. `unslop` — уже стоит.
2. `web-design-guidelines` — дешёвый аудит вёрстки.
3. `humanizer-ru` — вычистить русские тексты.
4. `accessibility-lead` — доступность как процесс, а не разовая проверка.

### Для тестов и APK

5. Playwright MCP — сценарии и скриншоты.
6. Mobile MCP — проверка настоящего APK.
7. Lighthouse MCP — PWA/офлайн.

### Когда появится git-репозиторий

8. GitHub MCP — issues, PR, CI, релизы.

## 5. Порядок внедрения

1. `brew install node` (22 LTS) — без него MCP-серверы на Node не поедут.
2. Поставить `web-design-guidelines` и `humanizer-ru` в `.dsh/skills`.
3. Прогнать `unslop`-полировку (см. `docs/UNSLOP-AUDIT.md`).
4. Поднять Playwright MCP и записать 3 e2e-сценария: регистрация, магазин,
   переключение аккаунта.
5. Поднять Mobile MCP и проверить APK на эмуляторе: «Назад», авиарежим,
   поворот (заблокирован), шрифт 100%.
6. Добавить Lighthouse MCP в CI/локально: PWA-балл и офлайн.
7. Только после этого — GitHub MCP и CI.
