# kekkeys — проектный документ

Упрощённый аналог Touch Portal: пользователь настраивает доски с кнопками-хоткеями на телефоне и нажимает их при работе с графическим/иным софтом на ПК. Семантика «зажал на телефоне → зажалось на ПК, отпустил → отпустилось» (hold-режим), что позволяет одной моделью покрыть и обычные комбинации, и удержание модификаторов.

---

## 1. Vision

- **Целевой пользователь:** владельцы планшетов (Surface, iPad-как-второй-экран, Android-планшеты) и просто телефонов рядом с рабочим местом, кому нужны быстрые хоткеи в Photoshop / Figma / Blender / DaVinci / OBS / IDE и т. п.
- **Главный отличительный принцип от конкурентов:** конфигурация **полностью на телефоне**. Десктоп — это «глупый» компаньон, который только принимает события и нажимает клавиши. Никакого редактора на десктопе.
- **Основной режим:** hold = press, release = release. Тап = очень короткий hold, ОС видит обычное нажатие.
- **Бренд:** kekkeys. Домен — занять (`kekkeys.com` / `kekkeys.app` — проверить и взять оба, если свободны).

---

## 2. MVP scope

### 2.1. Что входит в MVP

- Desktop-приложение под Windows (tray-only, Electron + TS).
- Mobile-приложение под Android (Expo + TS), раздаётся как direct APK с лендинга. Google Play подключим позже, когда сами поюзаем и поправим UX.
- Авто-обнаружение PC по mDNS в одной WiFi-сети + QR-фолбек.
- Пейринг через QR с одноразовым токеном, далее долгоживущий ключ.
- Один активный коннект телефон↔PC в момент времени. Телефон ведёт «адресную книгу» нескольких PC и переключается между ними.
- Доски, кнопки, грид-раскладка (от 2×2 до 10×14, размер настраивается на доску).
- Кнопка: иконка и/или текст, действие = комбинация клавиш (включая медиа-клавиши).
- Визуальный билдер комбинаций: экранная клавиатура с залипающими модификаторами + основная клавиша.
- Иконки: **полный набор Material Symbols** (~3500) с офлайн-поиском по имени и тегам. Метаданные забандлены, SVG лениво подгружаются с `fonts.gstatic.com` и кэшируются на диск.
- Локальное хранение конфига на телефоне + экспорт/импорт JSON.
- Локализация UI: EN (приоритет) + RU.
- Лендинг (Next.js): EN + RU, ссылки на скачивание Windows-инсталлера и APK, privacy policy, краткая инструкция «как установить без подписи / без unknown sources».
- Без аналитики, без аккаунтов, без облака.

### 2.2. Что осознанно НЕ в MVP

- iOS-клиент (нет devices у разработчика; рассмотрим позже).
- Авто-определение активного приложения и автопереключение досок (переключение только вручную).
- Действия кроме клавиш (запуск программ, ввод текста, URL, макросы-последовательности).
- Страницы/папки внутри доски — одна доска = один экран.
- Облачная синхронизация и шеринг шаблонов досок.
- Toggle-кнопки (залипающие переключатели). Hold-режима достаточно.
- Code signing.
- 10 языков лендинга и приложения (только EN+RU в MVP).
- Темы, кастомные цвета, кастомные иконки — это PRO в v1.1.

### 2.3. Нефункциональные требования

- **Latency target:** end-to-end задержка от touchstart на телефоне до KEYDOWN в активном окне Windows < 80 ms на одной WiFi-сети (чисто, без перегруза).
- **Reliability:** при разрыве коннекта десктоп **обязан** отпустить все «висящие» клавиши. Иначе риск залипшего Ctrl/Alt — это плохой UX и потенциальный security-issue.
- **Безопасность:** только запейренные устройства могут слать события. Ключи на устройствах хранятся в защищённом сторе (на Android — `expo-secure-store`, на Windows — DPAPI через `safeStorage` Electron).

---

## 3. Tech stack

| Слой | Стек | Заметки |
|---|---|---|
| Desktop | Electron + TypeScript | Tray-only приложение, окно открывается по клику на иконку трея. |
| Desktop key injection | `@nut-tree-fork/nut-js` (или альтернатива через native addon) | Нужны раздельные `pressKey` / `releaseKey`, не `type`. |
| Desktop discovery | `bonjour-service` (mDNS advertise) | Сервис `_kekkeys._tcp.local`. |
| Desktop transport | `ws` (WebSocket server) | Локальный порт, разрешить в брандмауэре при первом запуске. |
| Mobile | Expo (React Native) + TypeScript | EAS Build для APK, потом Play Store. |
| Mobile discovery | `react-native-zeroconf` | mDNS-сканирование. |
| Mobile transport | нативный WebSocket | Тот же протокол, что и десктоп. |
| Mobile secure storage | `expo-secure-store` | Ключи пейринга. |
| Mobile haptics | `expo-haptics` | На нажатии кнопки, опция в настройках. |
| Иконки | Material Symbols (Apache 2.0), полный набор | Метаданные (имена + теги + категории) забандлены (~150 КБ gzip). SVG лениво с `fonts.gstatic.com`, кэш через `expo-file-system`. Поиск офлайн через `Fuse.js`. |
| Лендинг | Next.js (App Router, SSG) | i18n EN+RU в MVP, расширение до 10 языков потом. |
| Версионирование | semver | Электрон автообновление через `electron-updater`, Expo через EAS Update. |

---

## 4. Архитектура

### 4.1. Высокоуровневая схема

```
┌─────────────────┐       WiFi LAN        ┌─────────────────────┐
│  Phone (Expo)   │  ◄──── WebSocket ───► │  PC (Electron tray) │
│                 │                        │                     │
│ ┌─────────────┐ │     mDNS discovery    │ ┌─────────────────┐ │
│ │  Editor UI  │ │  ───────────────────► │ │ Bonjour service │ │
│ │   Boards    │ │                        │ │ _kekkeys._tcp   │ │
│ │  Settings   │ │  QR pairing fallback  │ └─────────────────┘ │
│ └─────────────┘ │  ◄─────────────────── │                     │
│                 │                        │ ┌─────────────────┐ │
│ ┌─────────────┐ │   press/release msgs  │ │ Key injector    │ │
│ │  Runtime UI │ │  ───────────────────► │ │ (nut.js)        │ │
│ │ (keypads)   │ │                        │ └─────────────────┘ │
│ └─────────────┘ │                        │                     │
└─────────────────┘                        └─────────────────────┘
```

### 4.2. Pairing flow

1. Десктоп при запуске генерирует/читает persistent `deviceId` и стартует:
   - WebSocket-сервер на свободном порту.
   - mDNS-объявление сервиса `_kekkeys._tcp.local` с `deviceId`, портом, человекочитаемым именем PC.
   - Окно с QR (показывает `host:port#pairingToken`, токен — одноразовый, ttl 5 минут, ротация при открытии окна).
2. Телефон при добавлении нового PC:
   - Сканирует mDNS, показывает найденные PC.
   - Если ничего нет — кнопка «Сканировать QR».
3. После выбора/скана телефон коннектится по WS, шлёт `pair { pairingToken, phoneName, phonePubKey }`.
4. Десктоп:
   - Проверяет токен (не истёк, не использован).
   - Генерирует и сохраняет per-device shared secret, ассоциирует с `phonePubKey`.
   - Возвращает `paired { pcDeviceId, sharedSecret, pcName }`.
5. Телефон сохраняет запись в адресной книге (SecureStore).
6. На последующих коннектах: handshake с HMAC по `sharedSecret`, без QR.

### 4.3. Протокол сообщений

Все сообщения — JSON, поверх WebSocket. Поля:

**Auth/handshake**
- `→ pair { pairingToken, phoneName, phonePubKey }`
- `← paired { pcDeviceId, sharedSecret, pcName }`
- `→ hello { phoneDeviceId, hmac }` — на каждый реконнект
- `← welcome { pcName, protocolVersion }`

**Runtime — press/release**
- `→ press { evtId, buttonId, keys: ["ControlLeft","ShiftLeft","KeyS"] }`
- `← ack { evtId }` (опционально, для дебага)
- `→ release { evtId, buttonId }`

Имена клавиш — по [W3C UI Events `code` values](https://www.w3.org/TR/uievents-code/), маппинг на Windows VK на десктопе.

**Heartbeat**
- `→ ping { ts }` каждые 2 с
- `← pong { ts }`
- При отсутствии pong > 5 с — десктоп считает клиента отвалившимся, отпускает все клавиши.

**Прочее**
- `← state { connectedClients, activeClientName }` — десктоп шлёт телефону, телефон может отображать.

### 4.4. Reference counting клавиш на десктопе

Если на доске две кнопки `Ctrl+C` и `Ctrl+V`, юзер зажал обе одновременно. Десктоп держит счётчики `Map<KeyCode, refCount>`:
- На `press` для каждой клавиши `++`. Если был 0 → шлёт KEYDOWN.
- На `release` для каждой клавиши `--`. Если стал 0 → шлёт KEYUP.
- При дисконнекте клиента — обнуляет все счётчики и шлёт KEYUP на все клавиши, которые были подняты.

Это критично — без этого можно получить залипший Ctrl.

### 4.5. Модель данных (на телефоне)

```ts
type KeyCode = string; // W3C code, e.g. "ControlLeft", "KeyS", "AudioVolumeUp"

interface Pairing {
  id: string;            // pcDeviceId
  name: string;          // имя PC
  lastHost?: string;     // последний известный host:port (для прямого реконнекта)
  sharedSecret: string;  // в SecureStore
  addedAt: number;
}

interface Button {
  id: string;
  x: number;             // 0..gridCols-1
  y: number;             // 0..gridRows-1
  label?: string;        // текст
  iconName?: string;     // имя из Material Symbols
  // PRO-only поля (в free игнорируются):
  bgColor?: string;
  iconColor?: string;
  textColor?: string;
  customIconUri?: string;
  action: {
    type: "keys";
    keys: KeyCode[];
  };
}

interface Board {
  id: string;
  name: string;
  gridCols: number;      // 2..10
  gridRows: number;      // 2..14
  buttons: Button[];
}

interface AppState {
  pairings: Pairing[];
  activePairingId?: string;
  boards: Board[];       // в free — длина 1
  activeBoardId?: string;
  settings: {
    locale: "en" | "ru";
    haptics: boolean;
    pressedHighlight: boolean;
    // ...
  };
  pro: {
    active: boolean;     // из Google Play Billing
  };
}
```

Экспорт/импорт — весь `AppState` минус `sharedSecret`'ы (пейринги при импорте на новое устройство всё равно невалидны).

### 4.6. Десктопное окно

Tray-only. Двойной клик / правый клик → меню → Open / Quit / Auto-start (чекбокс). Окно содержит:
- **Статус коннекта:** «Connected: <phoneName>» или «Waiting for connection».
- **QR-код** (когда не подключён) — `host:port#pairingToken`.
- **Список запейренных телефонов** — имя, last seen, кнопка Forget.
- **Troubleshooting блок** (когда не подключён): «Telefon не видит PC? Проверь: одна WiFi-сеть, mDNS не блокируется роутером, брандмауэр Windows разрешил kekkeys, попробуй QR».
- **Версия + ссылка на лендинг.**

### 4.7. UX мобилки — две зоны

- **Editor mode** — список досок, редактор грида, билдер комбинаций, настройки, пейринг.
- **Run mode** — полноэкранный грид кнопок текущей доски. Жест переключения досок (свайп вбок) или явный селектор сверху. Визуальная подсветка кнопки на время удержания, опциональная вибрация.

Обе ориентации — грид перерисовывается, координаты кнопок остаются те же, ячейка просто шире/уже.

### 4.8. Иконки — поиск и загрузка

- **Источник:** Material Symbols, лицензия Apache 2.0.
- **Метаданные** (`packages/icons-meta`) — генерируются на CI из `https://fonts.google.com/metadata/icons`. Структура: `[{ name, categories, tags, popularity }]`. Бандлятся в APK как JSON (~150 КБ gzip).
- **Поиск** — на телефоне через `Fuse.js` по полям `name` + `tags` + `categories`. Работает офлайн, мгновенно. UI: строка поиска + грид превьюх 6×N с виртуализацией (`FlashList`).
- **Стиль в MVP:** Outlined, weight 400, optical size 24, fill=0. Альтернативные стили (Rounded/Sharp, Fill on) — кандидат на PRO в v1.1+.
- **SVG-загрузка:** при появлении иконки в выдаче (или при первом рендере на доске) шлём GET на `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/<name>/default/24px.svg`. Парсим, рендерим через `react-native-svg`, сохраняем в `expo-file-system` cache directory.
- **Топ-200 самых популярных** иконок (по полю `popularity` из метаданных) — забандлены прямо в APK как SVG-строки, чтобы UI не был пустым при первом запуске без интернета.
- **Cache eviction:** простой LRU по `mtime`, лимит ~10 МБ. На практике пользователь использует <100 иконок реально.

### 4.9. Билдер комбинаций (визуальный)

Экранная клавиатура раскладки PC:
- Слева — модификаторы (`Ctrl L/R`, `Shift L/R`, `Alt L/R`, `Win`), тап = залипает.
- Основная зона — буквы, цифры, F1-F24, стрелки, Enter/Tab/Esc/Space, Numpad, медиа-клавиши.
- Снизу — превью «Ctrl + Shift + S».
- Кнопка «Очистить», «Готово».
- Сохраняется список `KeyCode[]`.

---

## 5. Безопасность и приватность

- **Не отправляем** никаких событий нажатий куда-либо кроме запейренного PC. Никакой телеметрии.
- **mDNS** объявляет только имя PC и порт — это норма для локальных сервисов.
- **Pairing token** одноразовый, ttl 5 минут.
- **Shared secret** генерируется crypto-secure RNG (32 байта), хранится в SecureStore (Android Keystore) и через `safeStorage` Electron (DPAPI).
- **Все runtime-сообщения** идут с HMAC-SHA256 от секрета, чтобы атакующий из той же сети не мог подменить evt.
- **Privacy policy:** короткий шаблонный документ на лендинге. Что собираем: ничего, кроме того что хранится локально на устройствах. Google Play «Data safety» декларация — все категории «No data collected».
- **Permissions Android:** только `INTERNET` и сетевые. Нет камеры (QR сканируем — стоп, для скана QR камера нужна → добавляем `CAMERA`).

---

## 6. Монетизация (v1.1)

- **Free:**
  - 1 доска.
  - Без ограничения количества кнопок.
  - Стандартный набор Material Symbols.
  - Дефолтные цвета.
- **PRO (подписка через Google Play Billing, дешёвая):**
  - Неограниченное количество досок.
  - Кастомные цвета фона кнопки, цвета иконки, цвета текста.
  - Кастомные иконки (загрузка PNG/SVG).
- Локально PRO-флаг хранится как закешированный результат billing-проверки + периодическая ревалидация.
- Данные пользователя при отписке остаются — просто PRO-фичи перестают применяться (например, доски сверх первой скрываются, можно выбрать «активную»).

---

## 7. Лендинг

Стек: Next.js (App Router, SSG), i18n EN+RU.

Страницы:
- `/` — hero, видео-демо (loop GIF), 3 фичи, CTA «Download for Windows» / «Download APK», скриншоты телефона+ПК.
- `/download` — две кнопки + инструкции «как обойти SmartScreen» / «как разрешить установку APK».
- `/privacy`
- `/terms`
- `/docs/quick-start` — пошаговая инструкция первого пейринга.

SEO:
- Уникальные title/description, OG-теги, sitemap, robots.txt.
- Целевые ключи: `touch portal alternative`, `streamdeck on phone`, `phone hotkeys for photoshop`, `tablet hotkey app`, `usb-free streamdeck`, RU-аналоги.
- Schema.org `SoftwareApplication`.
- Никакой аналитики в MVP.

В будущем — расширить до 10 языков: EN, ES, PT-BR, DE, FR, IT, RU, JA, ZH-CN, KO.

---

## 8. Распространение

- **Windows installer:** NSIS через `electron-builder`. Без code-signing в MVP, на лендинге явная инструкция «More info → Run anyway». В роадмапе — Certum Open Source code-signing (~$30-70/год) после первых платных юзеров.
- **APK:** EAS Build, signed своим keystore. Direct download с лендинга — основной канал в MVP. Google Play выкладываем после того как сами поюзаем и убедимся что UX ок.
- **Auto-update:**
  - Desktop: `electron-updater` против GitHub Releases.
  - Mobile: EAS Update (OTA для JS-бандла), полные релизы — APK на лендинге + Play Store позже.

---

## 9. Roadmap

### MVP (v1.0)
- Всё из секции «MVP scope».
- Цель: личное использование разработчиком, валидация UX и латентности.

### v1.1 — Монетизация
- Google Play публикация.
- Google Play Billing, PRO-подписка.
- Кастомные цвета и иконки.
- Множественные доски.

### v1.2 — Полировка и языки
- Локализация лендинга и приложения на 10 языков.
- Code signing для Windows.
- Шаблоны досок «из коробки» для популярного софта (Photoshop, Figma, Blender, DaVinci, OBS, VS Code).

### v2 — Расширение функционала
- Авто-определение активного приложения на PC и автопереключение досок.
- Действия кроме клавиш: текст, URL, запуск программ, медиа-команды отдельно от клавиш, мини-макросы.
- Облачная синхронизация конфига между устройствами (привязано к PRO).
- Шеринг шаблонов досок между пользователями.

### v3 — Платформы
- iOS-клиент (когда появится тестовое устройство).
- macOS / Linux десктоп.
- Toggle-кнопки и страницы внутри доски (если будет запрос).

---

## 10. Риски и open questions

| Риск | Митигация |
|---|---|
| Брандмауэр Windows блокирует входящий порт | При первом запуске Electron триггерит UAC-промпт `netsh advfirewall` или просим юзера разрешить вручную; в окне статуса инструкция. |
| mDNS режется корпоративным/гостевым WiFi | QR-фолбек уже есть. |
| Латентность выше 80 мс | Замерить на ранней стадии. WebSocket binary frames вместо JSON если станет горлышком. Профилировать `nut.js` — известно что некоторые либы тормозят на keydown. |
| `nut.js` или альтернатива не даёт чистого press/release | Запасной план — собственный native addon на N-API + Win32 `SendInput` (это ~50 строк C++). |
| Залипшая клавиша при крэше десктопа | Реф-каунтер + явный flush на дисконнект + on-startup release всех модификаторов. |
| Win-клавиша частично перехватывается ОС (Win+D, Win+L) | Ограничение ОС, не наше. Документируем. |
| SmartScreen ругается на неподписанный установщик | Инструкция на лендинге; план купить Certum после валидации продукта. |
| Apple kills network discovery / background WS | На Android Expo с foreground service это решаемо. iOS отложен. |

**Open questions, которые решим в ходе разработки:**
- Лимиты PRO — конкретные цифры (цена подписки, триал?).
- Нужно ли устанавливать Bonjour Print Services на Windows для mDNS (на Win10/11 обычно работает из коробки, проверить).
- Имя сервиса mDNS — `_kekkeys._tcp.local` или generic. Проверить что не конфликтует.

---

## 11. Структура репозитория (план)

```
/
├── apps/
│   ├── desktop/        # Electron app
│   ├── mobile/         # Expo app
│   └── landing/        # Next.js
├── packages/
│   ├── protocol/       # shared TS types для WS-сообщений
│   └── icons-meta/     # сгенерированные метаданные Material Symbols
├── doc/
│   └── project/
│       └── project.md  # этот документ
└── .claude/
    └── rules/
```

Монорепо через pnpm workspaces (или npm workspaces). Shared `protocol` пакет гарантирует что desktop и mobile говорят на одном языке.

---

## 12. Definition of Done для MVP

- [ ] Запейрить телефон с PC через QR (без mDNS).
- [ ] Запейрить через mDNS-обнаружение.
- [ ] Создать доску, задать грид, добавить кнопку с иконкой и комбинацией `Ctrl+Shift+S`.
- [ ] Зажать кнопку на телефоне → в Photoshop сработала комбинация. Отпустить → отжалось.
- [ ] Зажать `Spacebar` → в Photoshop включился pan-режим. Отпустить → выключился.
- [ ] Дёрнуть WiFi во время удержания → на ПК клавиши отжались автоматически.
- [ ] Экспорт конфига в JSON, импорт на другом телефоне.
- [ ] Десктоп переживает рестарт, авто-стартует с Windows (если включена опция), помнит запейренные устройства.
- [ ] Лендинг live, обе ссылки на скачивание работают, privacy policy опубликована.
- [ ] EN и RU интерфейсы переведены.
