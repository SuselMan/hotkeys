# v1.0.0 release checklist

Последний раз обновлено: 2026-05-10. Дедлайн: чт 14 мая.

Это runbook — пошаговая инструкция чего и в каком порядке делать. Чек-боксы — отмечать по ходу. Параллельные задачи в одной секции можно делать в любом порядке.

## Уже сделано

- [x] **#4** Брендовые иконки везде (mobile / desktop / landing / Play hi-res / feature graphic 1024×500)
- [x] **#5** Промо-видео скрипт (en + ru)
- [x] **#7** Landing SEO (data-driven копи, JSON-LD, FAQ schema, hreflang × 5 локалей)
- [x] **#15** Version 1.0.0 везде в package.json + Expo app.json
- [x] **#16** Mobile i18n × 5 локалей (en / ru / es / de / ja)
- [x] **#26** Иконки интегрированы (Android adaptive, Windows .ico, tray PNG, landing favicon, OG)
- [x] **#27** Promo voiceover в `doc/marketing/promo-script.{en,ru}.md`
- [x] **#29** Landing SEO — JSON-LD SoftwareApplication + FAQPage, x-default hreflang
- [x] **#31** Все 5 локалей лендинга (en/ru/es/de/ja) с правильными hreflang
- [x] **#35** Version bump 1.0.0
- [x] **#32 scaffold** IAP-код в `apps/mobile/src/iap.ts` готов, `react-native-iap@12.16.4` поставлен
- [x] Скриншоты загружены в Play Console (по словам пользователя)
- [x] Landing live на kekkeys.online (HTTPS cert провизится Let's Encrypt'ом, ждём)
- [x] Package id `online.kekkeys.app` зафиксирован
- [x] App entry в Play Console создан, App access / Target age / Category заполнены
- [x] EAS `development` profile добавлен в `eas.json`
- [x] BILLING permission в `app.json` (нужно для in-app products)

## Шаг 1 — Запустить EAS-сборки (сейчас)

Параллельные сборки на EAS-облаке. **Запускай оба сразу** — пока ждёшь, делаешь Play Console.

```bash
cd apps/mobile
eas build --profile preview --platform android      # APK для теста на телефоне (~20 мин)
eas build --profile production --platform android   # AAB для Play Console (~20 мин)
```

- [x] Preview APK build готов
- [x] Production AAB build готов

**Что выбрать если только один:** для теста IAP — `preview`. Для Play Console — `production` (AAB обязателен для Play).

## Шаг 2 — Заполнить листинг в Play Console (пока сборки идут)

Текст всех полей готов в `doc/marketing/play-store-listing.md`. Просто копи-пейст.

### 2.1. Main store listing (en-US — default)
- [x] App name: `kekkeys`
- [x] Short description (80c) — копи из доки
- [x] Full description (4000c) — копи из доки
- [x] App icon: `apps/mobile/assets/icons/playstore.png` (512×512)
- [x] Feature graphic: `apps/mobile/assets/icons/1024x500.png`
- [x] 8 phone screenshots (уже загружено)
- [x] Promo video URL: пропустить пока (добавить после релиза)

### 2.2. Custom store listings (опционально, но повышает конверсию в локалях)
- [x] ru-RU — копи из доки
- [x] es-ES — копи из доки
- [x] de-DE — копи из доки
- [x] ja-JP — копи из доки

### 2.3. Обязательные мета-поля
- [x] Privacy Policy URL: `https://kekkeys.online/en/privacy/`
- [x] Website: `https://kekkeys.online/`
- [x] Support email: твой email
- [x] Content rating questionnaire — все ответы NO → должно получиться Everyone / PEGI 3
- [x] Data Safety: Data collected = None, Data shared = None
- [x] Ads: No ads
- [x] Target audience: 13–15, 16–17, 18+ (3 старшие группы)
- [x] App access: «All app functionality is available without restrictions» + опциональная заметка про desktop companion

## Шаг 3 — Когда production AAB готов: Internal Testing track

**Это критично делать ПЕРЕД созданием IAP-продукта.** Play Console не разрешает создавать managed products пока не увидит AAB с BILLING permission на каком-то треке.

### 3.1. Загрузить AAB
- [ ] Скачать AAB из EAS dashboard
- [ ] Play Console → **Testing → Internal testing → Create new release**
- [ ] Upload AAB
- [ ] Release notes: `Initial release. Programmable hotkey deck for Windows from your Android phone. Local pairing via QR, no cloud. Free for one board; PRO unlocks the rest at $9.99 lifetime.`
- [ ] **Save and review** → пройти валидации Play (если ругается на что-то — поправить)

### 3.2. Создать тестер-список
- [ ] Internal testing → вкладка **Testers** → Create email list
- [ ] Добавить свой Google email (тот что на тестовом телефоне)
- [ ] Скопировать **opt-in URL** — пригодится в шаге 5

## Шаг 4 — Создать IAP managed product

Только после того как AAB прошёл первичную валидацию Play на Internal track (пара минут).

- [ ] Play Console → **Monetize → Products → In-app products → Create product**
- [ ] Product ID: `pro_lifetime` ← **строго так, не менять — захардкожено в `iap.ts`**
- [ ] Name: `kekkeys PRO`
- [ ] Description: `Unlimited boards, custom button colors, custom uploaded icons, multi-PC pairing`
- [ ] Status: **Active**
- [ ] Default language: English (United States)
- [ ] Default price: **$9.99** (Google авто-конвертит в локальные валюты)
- [ ] Save

⚠️ Play **кэширует «product not found» 2-4 часа**. Это нормальное поведение, не паникуй. К моменту IAP-теста (шаг 6) это уже разойдётся.

## Шаг 5 — License testers (для sandbox-покупок без денег)

- [ ] Play Console → **Setup → License testing**
- [ ] Add testers → email = твой Google-аккаунт на тестовом телефоне
- [ ] License response: `RESPOND_NORMALLY` (default)
- [ ] Save

## Шаг 6 — Тестирование IAP в sandbox

После того как:
- Preview APK готов (или зашёл по opt-in URL и поставил из Play Store)
- Прошло хотя бы 30 минут с создания продукта `pro_lifetime`
- Твой email в License testers
- AAB загружен в Internal track

### 6.1. Установить приложение на телефон
- [ ] Вариант A: скачать preview APK с EAS, перенести на телефон, установить (разрешить «Unknown sources» если попросит)
- [ ] Вариант B: открыть opt-in URL на телефоне → стать тестером → дождаться появления приложения в Play Store (обычно 5-15 мин) → установить как обычно

### 6.2. Запустить покупку
- [ ] Открыть kekkeys → попробовать создать вторую доску → попадёшь на Upgrade screen (или открыть напрямую через сценарий с custom icon в editor'е)
- [ ] Тапнуть **Get PRO**
- [ ] Должна открыться Google Play модалка покупки
- [ ] Цена в твоей локальной валюте (₽790, €9.99, etc.)
- [ ] Под ценой пометка **«Test card · No charge»** или равноценный текст
- [ ] Подтвердить → модалка закрывается → юзер становится PRO → Upgrade screen закрывается
- [ ] Создать вторую доску — должно получиться (PRO разблокировал)

### 6.3. Тест Restore
- [ ] Удалить приложение
- [ ] Установить заново
- [ ] Открыть Upgrade screen → тапнуть **Restore purchases**
- [ ] Должен прийти alert «PRO restored», без модалки оплаты
- [ ] Юзер снова PRO

### 6.4. Если что-то не работает

Чаще всего:
- Прошло меньше 30 мин с создания продукта → подождать
- Аккаунт на телефоне не в License testers → перепроверить
- Продукт не Active → перепроверить статус
- AAB не загружен в Internal track → перепроверить

Логи Billing: `adb logcat | findstr [iap]` (Windows) или `adb logcat | grep "\[iap\]"`. Наш модуль логирует всё с префиксом `[iap]`.

## Шаг 7 — Promote Internal → Production

Когда IAP в sandbox работает (шаг 6 зелёный):
- [ ] Play Console → **Production → Create new release**
- [ ] **Promote release** → выбрать AAB из Internal Testing
- [ ] Release notes (en + ru + es + de + ja) — копи из `doc/marketing/play-store-listing.md` секция «What's new»
- [ ] Rollout: 100% (без staged rollout для v1.0)
- [ ] **Save and review** → **Send for review**
- [ ] Ожидать **24-72 часа** на app review

## Шаг 8 — Параллельно: Windows .exe + GitHub Release

Не ждёт Play, можно делать сегодня же когда Internal track залит.

### 8.1. Собрать .exe
```bash
cd apps/desktop
npm run dist:win
```

Артефакт появится в `apps/desktop/release/kekkeys-setup.exe`.

- [ ] Build выполнен без ошибок
- [ ] `kekkeys-setup.exe` есть в release/

### 8.2. Создать GH Release
- [ ] GitHub → repo → **Releases → Draft new release**
- [ ] **Choose a tag**: ввести `v1.0.0` → создастся новый
- [ ] Title: `v1.0.0 — Initial release`
- [ ] Body — текст ниже
- [ ] **Attach binaries**: перетащить `kekkeys-setup.exe` (и опционально preview `.apk` если хочешь чтобы кнопка APK на лендинге работала)
- [ ] **Publish release**

Шаблон Release notes:

```
First public release of kekkeys.

Phone-controlled hotkey deck for Windows from your Android phone.
Local-first pairing via QR — no cloud, no telemetry.

## Downloads
- **Windows installer:** kekkeys-setup.exe (Windows 10/11 x64)
- **Android APK:** kekkeys.apk (или из Google Play когда станет доступно)

## What's in v1.0.0
- Programmable boards on the phone with drag-drop builder
- 3866 Material Symbols icons + custom uploads (PRO)
- Real keystrokes via local WiFi pairing — works with any keyboard layout
- Sticky/Latch toggle for held modifiers
- Multi-touch chords (Ctrl+Shift+Z and friends)
- Multiple boards with PRO ($9.99 lifetime, no subscription)

## Privacy
No accounts, no servers, no telemetry. Pairing happens via QR over local
WiFi; secrets stay in OS keystores. See https://kekkeys.online/en/privacy/
```

### 8.3. Проверить что landing-кнопки работают
- [ ] `https://kekkeys.online/en/download/` → кнопка «Download for Windows» → файл скачивается
- [ ] `https://kekkeys.online/en/download/` → кнопка «Download APK» → если залил .apk в Release, файл скачивается; если нет, страница 404 — это пока ок, юзер пойдёт через Play Store

## Шаг 9 — HTTPS-cert на лендинге

- [ ] Settings → Pages: проверить что cert уже выпустился (галочка «Enforce HTTPS» стала кликабельной)
- [ ] Включить **Enforce HTTPS**
- [ ] Открыть `https://kekkeys.online/` — должен быть зелёный замочек, без mixed-content warning
- [ ] Кинуть `https://kekkeys.online/` в Discord/Telegram/Slack чтобы проверить OG-карточку (1200×630.png должна показаться)

## Шаг 10 — Submit sitemap в Search Consoles

Не блокирует релиз, но важно для индексации. Делается за 5 минут.

- [ ] Google Search Console: add property `kekkeys.online` (DNS verification — должна сразу пройти, у нас уже DNS настроен) → submit `https://kekkeys.online/sitemap.xml`
- [ ] Bing Webmaster Tools: то же
- [ ] Yandex Webmaster (опционально, для ru-сегмента): то же + Region preference = Russia

## Шаг 11 — Анонс (когда Play approve)

Когда приложение появится в Play Store:
- [ ] Опционально: добавить ссылку на Play Store в `apps/landing/app/_components/DownloadPage.tsx` → закоммитить → лендинг автоматом обновится через GH Action
- [ ] Reddit-посты: r/streaming, r/blender, r/animation, r/AndroidApps, r/Windows10 / r/Windows11
- [ ] Hacker News: Show HN: kekkeys — phone Stream Deck app
- [ ] Twitter / X: launch tweet
- [ ] Profile-чанные Discord-серверы (стримерские, художественные)

## Если что-то ломается

| Симптом | Что проверить |
|---|---|
| `eas build` падает на установке зависимостей | проверь что `npm install` локально работает; обнови `eas-cli` если просит |
| Play Console говорит «no in-app products yet, add BILLING permission» | продьюсонал AAB ещё не загружен или BILLING нет в манифесте — пере-собрать с новым `app.json` (BILLING permission) и заново загрузить |
| IAP test card не открывается | прошло мало времени с создания продукта (ждать 30+ мин), не в License testers, продукт не Active, или AAB ещё не на треке |
| App review reject | прочитать причину в Play Console — обычно Data safety или privacy URL; поправить и пере-сабмит |
| Lending HTTPS не работает после 24ч | Settings → Pages → удалить custom domain → подождать минуту → ввести заново → форсит Let's Encrypt re-issue |

## После релиза — на v1.1+

Не блокирует v1.0, но из аудитов и обсуждений:
- Search Console подключить и собирать данные о реальных запросах
- OBS integration page на лендинге `/{en,ru}/for/obs/` (по `obs hotkeys` 12 EN, `пульт для obs` 10 RU)
- DIY-статья по-русски `/ru/blog/sdelat-strim-dek-iz-telefona/` (~80 long-tail показов)
- Reach out к авторам обзоров (okeygeek, kakichem, makeuseof)
- Локализованные промо-видео (ru/es/de/ja) — переводим с финальной ru-версии
- iOS-клиент
- Code-signing для Windows .exe (EV cert)
- RuStore для российских юзеров
