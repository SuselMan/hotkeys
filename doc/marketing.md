# kekkeys — релиз, маркетинг, монетизация

Документ-оценка: что есть, чего не хватает для v1.0, как продвигать, сколько денег реалистично ждать. Прагматично и без сладкой воды.

---

## 1. Где мы сейчас

MVP по `doc/project/project.md` фактически закрыт (задачи 01–13 в `done/`). Что работает:

- Windows tray-app + Android APK + лендинг.
- Pairing (QR + persistent secret, HMAC handshake).
- Hold-семантика, ref-counting клавиш, flush на дисконнект.
- Полный Material Symbols (~3866) с офлайн-поиском.
- Доска-редактор, run-mode, экспорт/импорт JSON, EN+RU.
- Лендинг (Next.js, статика, SEO-теги, sitemap, hreflang).

Известные баги после первой полевой проверки уже закрыты — #14 (cleartext NSC в APK) и #15 (LAN IP picker для Surface).

Это **уже работающий продукт**, на котором можно делать платный релиз. Дальше — про то, что отделяет «работающее» от «продаваемого».

---

## 2. Чего реально не хватает для v1.0 (релиз-blockers)

Не «фич», а вещей без которых нельзя нажать «выпуск».

### 2.1. Code signing для Windows ⚠️ блокер

Сейчас `.exe` неподписанный. SmartScreen ругается «Windows protected your PC», у среднего юзера это **минус 30–50% install completion**. Нет смысла тратиться на трафик пока этого нет.

- Решение: Certum Open Source code signing, ~$30–70/год, выдают за пару дней. EV-сертификат не нужен — обычного достаточно для снятия предупреждения после нескольких сотен установок (билдинг репутации).
- Альтернатива: AzureSignTool + DigiCert. Дороже.
- В лендинге уже написана инструкция «More info → Run anyway» — её оставить как фолбек.

### 2.2. Crash reporting ⚠️ блокер для роста

Сейчас если приложение падает — мы не узнаем. Без этого нельзя итерировать.

- Sentry бесплатный план: 5k events/month — хватит на старте.
- Подключить и в Electron main+renderer, и в RN. Privacy-friendly: Sentry может работать с self-hosted сервером, но даже их облако не противоречит «no data collected» — личные данные пользователя (доски, ключи) всё равно никуда не утекают.

### 2.3. Onboarding для не-тех аудитории ⚠️ важно

Photoshop-юзеры и художники с Wacom — не разработчики. Текущий UX:
1. Юзер запускает APK.
2. Видит пустую вкладку Connect с QR-сканером.
3. ???

Нужны:
- Welcome-screen на первом запуске мобилки: «Откройте kekkeys на ПК → отсканируйте QR».
- Welcome-screen на первом запуске десктопа: один абзац «Поставьте APK на телефон, наведите на QR».
- На пустой вкладке Boards — большая кнопка-CTA «Start with template».

### 2.4. Templates / preset boards ⚠️ critical for adoption

В роадмапе на v1.2. Я бы передвинул на v1.0. Сейчас юзер открывает приложение → пустота → надо самому собирать доску с нуля → drop-off.

Минимальный набор: Photoshop, Figma, Blender, OBS, DaVinci Resolve, Premiere Pro, VS Code. По 8–12 кнопок в каждой. ~3 дня работы, огромный эффект на retention.

Хранить в репозитории как JSON, бандлить в APK + добавить «Browse templates» при создании доски.

### 2.5. Демо-видео / GIF на лендинге ⚠️ важно

Сейчас лендинг текстовый. У такого продукта **первое впечатление = видео**. Без него конверсия трафика в скачивание — минимальная.

- 10-секундный loop: телефон → нажатие → Photoshop реагирует.
- Снять можно за 30 минут на отдельную камеру, плюс OBS-захват экрана ПК.
- `<video autoplay muted loop>` в hero-секции лендинга вместо текста.

### 2.6. Иконки приложений ⚠️ blocker для Play Store

`apps/mobile/assets/icon.png` — placeholder. Adaptive icon — placeholder. Splash — placeholder. Tray icon на десктопе сейчас генерируется как BGRA bitmap в рантайме (см. #03), для production нужен ICO с приличным дизайном.

- Час работы дизайнера на Fiverr (~$20) или сделать самому в Figma.

### 2.7. Privacy policy + ToS — есть, но проверить под Play Store

Когда дойдёт до Play Store (а он точно нужен — 80%+ установок Android идут оттуда), Google потребует:
- Data Safety декларацию (у нас всё «No data collected» — гладко).
- Privacy policy на публичном URL (есть на лендинге).
- Возрастной рейтинг.
- Скриншоты в Play store (минимум 2, рекомендуется 8 + 1 feature graphic).

### 2.8. Auto-discovery на мобилке (mDNS) — **NOT** блокер

Вспомнил, что это в open follow-ups задачи #06. Не блокер — QR работает. Но сделает first-pair более «магическим» («появился в списке доступных PC сам»).

Требует custom dev client (выход за Expo Go). Месяц-два после launch — ок.

### 2.9. Bundle ID / domain claim

- `kekkeys.com` и `kekkeys.app` — занять немедленно если ещё свободны (project.md упоминает это как open question).
- Google Play developer аккаунт ($25 разовый платёж).
- Apple developer аккаунт **не нужен** — iOS не в MVP.

---

## 3. Чего сознательно НЕ делать в v1.0

Это так же важно как и список «что делать». Защита от feature creep.

- ❌ **iOS клиент.** Удваивает поверхность тестов и багов для одного разработчика. Ждём signal от Android-аудитории.
- ❌ **Действия кроме клавиш.** URLs, запуск программ, ввод текста, макросы. Каждая — отдельный pandora's box. После v1.0.
- ❌ **Pages внутри доски.** Hold-семантика и multi-board покрывают 95% сценариев. Pages — Touch Portal-style сложность.
- ❌ **Toggle-кнопки** (залипающие). 99% need-cases закрываются hold-режимом. Юзеры просят, но это путь к UI-bloat.
- ❌ **Авто-определение активного приложения.** Огромная сложность (Win32 hooks), Touch Portal даже это делает плохо. Ручное переключение работает.
- ❌ **Облачная синхронизация.** Аккаунты, серверы, GDPR. Экспорт/импорт JSON покрывает потребность переноса.
- ❌ **Macro recording** (последовательности нажатий). Очень сложно сделать так, чтобы тайминги корректно проигрывались на разных машинах. Resist.

Простота — наш единственный честный диффер от Touch Portal. Каждая фича, которую добавляем, размывает его.

---

## 4. Каких фич всё-таки очень не хватает

Несмотря на пункт 3, после реального использования вылезают мелочи без которых неудобно. Ранжирую по effort vs impact.

### 4.1. Высокий impact / низкий effort — добавить

| Фича | Зачем | Effort |
|---|---|---|
| **Drag-to-move кнопок** в редакторе | Сейчас чтобы переместить — удалить и создать заново. На реальной доске это случается часто. | 1 день |
| **Long-press → multi-select** для удаления нескольких кнопок сразу | После пары итераций редактирования у юзера 6 ненужных кнопок, удалять по одной — раздражает. | полдня |
| **Дублировать кнопку** | 80% соседних кнопок отличаются одной клавишей (Brush size +/-, F1/F2/F3). | пара часов |
| **Кнопка-разделитель / пустая ячейка** | Сейчас «пробел» в раскладке = пустая ячейка автоматически, но иногда хочется явно зарезервировать место. | минимально |
| **Слайдер яркости подсветки кнопок** в run-mode | iPad/планшет в светлой комнате — текущий dark theme плохо видно на солнце. | пара часов |
| **Слайдер размера лейбла** | На грид 10×14 текст микроскопический, на 2×2 — наоборот огромный. Авто-scale + override. | пара часов |

### 4.2. Средний impact / средний effort — рассмотреть

- **L/R distinction для модификаторов** (Ctrl L vs Ctrl R) — сейчас всё normalized в L. 95% пользователей не заметят, 5% (Blender power-users) очень нужны R-варианты. Toggle в combo-builder для advanced mode.
- **Lock screen orientation** — сейчас `orientation: "default"`, грид перерисовывается. Юзер может захотеть заблокировать landscape во время работы.
- **Quick-tap mode** — explicit «just tap, не hold». Технически tap уже работает (короткий hold), но для некоторых клавиш (медиа, Insert, NumLock) нужен явный «press-then-immediately-release» без удержания. Per-button checkbox.
- **Vibration intensity slider** — у каждого юзера разная толерантность.

### 4.3. Низкий impact / выглядит круто, но resist

- Анимации нажатия (scale/glow effect) — приятно, но добавляет 5–10 ms latency. У нас target <80 ms, нельзя терять.
- Кастомный фон доски (gradient/image). На v1.1 как PRO.
- Mini-map / preview. Чрезмерно для одного экрана.

### 4.4. То что уже в roadmap, не передвигать

- Колорпикеры цвета фона/иконки — PRO в v1.1, как написано.
- Кастомные иконки (PNG/SVG upload) — PRO в v1.1.
- 10 языков лендинга — после v1.0.

---

## 5. Монетизация

Текущий план в project.md — Free 1 доска / PRO много досок + цвета + кастомные иконки. Норм основа, но я бы уточнил.

### 5.1. Что делать Free

Free должен быть **полнофункциональным**. Иначе юзер уйдёт через 5 минут на Touch Portal.

- 1 доска (как и было). Без ограничения количества кнопок.
- **Все** Material Symbols.
- **Все** клавиши и комбинации.
- Hold-режим, экспорт/импорт.

Free не должен ощущаться как «триал».

### 5.2. Что в PRO

- **Множественные доски** — главный driver. Один пользователь хочет Photoshop и OBS — уже PRO.
- **Кастомные цвета** — фон кнопки, иконка, текст. Не критично, но красиво. Хорошо смотрится в скринах.
- **Кастомные иконки** (PNG/SVG upload).
- **Premium-templates** — расширенный набор готовых досок (DaVinci, Premiere, Lightroom, Substance).
- **Брендинг** — убрать «kekkeys» из угла run-mode (если он там вообще будет — пока нет, но это ленивый PRO-driver).

### 5.3. Цена

Бенчмарк:
- Touch Portal: $13 one-time.
- Stream Deck Mobile (Elgato): $2.99/мес или $24.99/год.
- DeckBoard: $9.99 one-time.
- Custom hardware Stream Deck: $150+.

Наша цель — **дешевле Touch Portal** + **проще** = no-brainer.

Предложение:
- **Lifetime PRO: $14.99** разово.
- **PRO subscription: $1.49/мес** или **$9.99/год** (= $0.83/мес effectively).
- Lifetime будет продаваться лучше для нишевой утилиты.
- **Early adopter pricing**: первые 1000 PRO — $9.99 lifetime forever. Создаёт urgency, награждает ранних, генерит word of mouth.

В Play Store нельзя lifetime через subscription — это **non-consumable in-app purchase**, отдельная сущность. Технически чуть сложнее, но supported.

### 5.4. Что не делать в монетизации

- ❌ **Реклама.** Несовместимо с позиционированием «privacy-first, no data collected».
- ❌ **Pay-per-board / pay-per-template.** Усложняет ментальную модель. Плоский PRO лучше.
- ❌ **Trial-периоды.** Free уже достаточно функционально. Trial = ещё один UX-стейт.
- ❌ **Donation-only.** Не работает на массовых утилитах. Подходит только для CLI-инструментов и FOSS-продуктов с devops-аудиторией.

---

## 6. Маркетинг

### 6.1. Позиционирование

Не пытаемся бороться с Touch Portal лоб в лоб (проиграем в фичах). Нацеливаемся на:

- **Wacom-юзеров без express keys.** Bamboo, Intuos S, мобильные модели — у всех нет физических хоткеев. Огромный underserved рынок.
- **Surface / iPad как secondary screen.** Юзер уже имеет планшет, не хочет покупать $150 Stream Deck.
- **Photoshop / Figma / Blender — non-streamer creators.** Touch Portal перекошен под streaming, у него mind share среди стримеров. Творческий профессионал — наша аудитория.
- **Не-разработчики, которым «Touch Portal слишком сложный».** Это реальная фраза в каждом втором отзыве на Touch Portal.

Слоган: **"Your tablet is now a Stream Deck. Free. Configured on your phone."**

### 6.2. Каналы

Ранжирую по cost vs reach.

#### 6.2.1. YouTube creator outreach — high impact

- Списать 20–50 ютуберов с туториалами по Photoshop, Blender, OBS, DaVinci. Аудитория 10k–500k.
- Написать каждому персонально: «Сделал бесплатную альтернативу Touch Portal, специально под Wacom-пользователей. Хочу прислать early access». Без cold-pitch вибраций.
- Cost: время. Конверсия 5–15% on outreach.
- Один интегрированный обзор у канала на 100k подписчиков = 1k–5k installs.

#### 6.2.2. Reddit — high effort, real impact

Подсабы:
- r/wacom (110k) — главная аудитория.
- r/photoshop (700k).
- r/blender (650k).
- r/Adobe.
- r/OBS (smaller).
- r/touchportal (отдельный, маленький — но точно наша аудитория, ищут альтернативы).
- r/SideProject, r/IndieHackers, r/SelfHosted (показать что free + privacy).

Тактика: **не спам-пост «вот мой проект»**. Сделать 5–6 полезных постов (туториалы, screenshot setup'ов, tips) с органичной mention. Один прямой launch-post с заголовком в стиле «I built a free Touch Portal alternative for Wacom users — phone-only config».

#### 6.2.3. Product Hunt — one-shot launch

- Один день видимости. Готовиться 2 недели: анонс в email-list (если будет), Twitter, Reddit.
- Целевой результат: Top 5 of the day = ~3k–10k posts/installs.
- Не воспринимать как спасение — больше как amplifier.

#### 6.2.4. Hacker News — попробовать, но низкое ожидание

- Audience: разработчики, не наша целевая. Но качественный «Show HN» может дать 1k–3k installs если зайдёт + ценен для tech-credibility.

#### 6.2.5. TikTok / YouTube Shorts — long-term play

- Демо 15-секундный loop как viral content. «Watch what this $0 app does to your iPad».
- Систематически постить — 3–4 в неделю. 95% постов умирают, 1 случайно стреляет на 100k+ views.
- Полгода работы прежде чем будет компаундить.

#### 6.2.6. SEO — passive income

- Лендинг уже SEO-готов.
- Целевые запросы: `touch portal alternative`, `streamdeck on phone`, `wacom hotkey app`, `phone hotkeys photoshop`, `tablet shortcuts photoshop`, RU-аналоги.
- Написать 5–10 SEO-постов на лендинге как `/blog`: «How to set up shortcuts on Wacom Bamboo», «Best Photoshop shortcut apps for 2026», «Touch Portal vs free alternatives».
- Compound effect 6+ месяцев.

#### 6.2.7. Платный traffic — НЕ сейчас

Conversion rate на холодный traffic для нишевой утилиты низкий. CAC на Google Ads будет $5–20, ARPU PRO $15. Не работает математически пока organic не дал baseline.

### 6.3. Лендинг — что доделать для конверсии

- Hero video / GIF (см. 2.5).
- Comparison table: kekkeys vs Touch Portal vs Stream Deck Mobile vs DeckBoard. Колонки: Price, Config UI, Free tier, Hold mode, Multi-touch, iOS, Android, Privacy.
- FAQ section: «Is it really free?», «Does it work without Internet?», «Can I use it without a Stream Deck?», «Why phone-only config?».
- Social proof: после первой 1k установок добавить «N+ creators use kekkeys» counter.
- «Used by» logos / testimonials когда появятся.
- Github stars badge (если репо публичный) — добавляет credibility.

---

## 7. Прогноз прибыли

Оговорка: гадание на кофейной гуще. Цифры основаны на benchmarks подобных утилит (Touch Portal в 2018, DeckBoard, mobile-first niche tools).

### 7.1. Conservative scenario (90% вероятность)

Один dev, без особых маркетинговых вложений, релиз без виралов.

- Год 1: 5,000–10,000 установок APK + Windows.
- PRO conversion: ~1% (типично для нишевых утилит без upsell-нажима).
- ARPU: $14.99 lifetime.
- Доход: $750–$1,500 за первый год.
- **«Coffee money», но валидирует продукт.**

### 7.2. Realistic scenario (50% вероятность)

С нормальным выполнением маркетинга из секции 6, один-два YouTube-обзора попали, Reddit-launch зашёл.

- Год 1: 30,000–60,000 установок.
- Conversion: 2%.
- Доход: $9,000–$18,000.
- Год 2 (без новых усилий): $5k–$10k от long-tail SEO + word of mouth.
- **Side-income tier. Достойный, но не replacement of full-time.**

### 7.3. Optimistic scenario (10% вероятность)

Виральный YouTube-обзор у канала на миллион подписчиков, PH топ-1, или Wacom официально упомянули. Что-то компаундит.

- Год 1: 200,000+ установок.
- Conversion: 3–4% (виральная аудитория более committed).
- Доход: $90,000–$150,000.
- **Можно работать full-time + один контрактор.**

### 7.4. Honest expectation

Базовый план — **realistic**. $10k–$20k за первый год это **не Touch Portal-уровень** ($1M+ ARR), но это солидно для side project одного разработчика. Главное — не сжигать деньги на рекламу, расти organically, и через 18–24 месяца либо иметь $50k+ ARR (хорошо для индии-разраба), либо понять что ниша меньше чем казалась и принять это.

Pessimistic-сценарий ($1k за год) тоже надо принять как возможный. У многих качественных утилит так бывает не из-за продукта, а из-за маркетинг-разрыва.

---

## 8. План на ближайшие 4–6 недель (до v1.0 launch)

В порядке зависимостей.

1. **Неделя 1:** Templates (Photoshop, Figma, Blender, OBS, DaVinci, Premiere, VS Code).
2. **Неделя 1–2:** Code signing — заказать Certum, дождаться. Пока ждём — параллельно делаем остальное.
3. **Неделя 2:** Иконки приложения, splash, адаптив.
4. **Неделя 2:** Sentry crash reporting в обоих apps.
5. **Неделя 2–3:** Onboarding (welcome screens, empty-state CTAs).
6. **Неделя 3:** Demo video / GIF для лендинга. Comparison table + FAQ.
7. **Неделя 3:** Drag-to-move + дублировать кнопку + multi-select (низкий effort фичи из 4.1).
8. **Неделя 4:** Beta testers — 10–20 человек из Reddit/Twitter, неделя на их фидбек.
9. **Неделя 5:** Полировка по фидбеку, фиксы.
10. **Неделя 5:** Google Play submission (review занимает 1–7 дней).
11. **Неделя 6:** Public launch — Reddit, HN, PH, YouTube outreach. Coordinated.

Параллельно: в backlog держать 4.1-фичи и L/R-modifier toggle, не релизить с ними.

---

## 9. Что измерять после релиза

Чтобы не действовать вслепую — но сохранить privacy-positioning.

### Privacy-friendly:
- Лендинг: Plausible/Umami на статике (cookie-free, EU-compliant).
- Скачивания APK с лендинга — counter в логах сервера.
- Releases на Github — counter скачиваний `.exe`.

### Pre-consent в самом приложении:
- Crash reports через Sentry — opt-out, в Settings checkbox «Send anonymous crash reports» (default ON, как ВСЕ адекватные утилиты делают).
- Никаких usage analytics в приложении в v1.0. Полагаемся на observable signals (PRO-подписки, store rating, Reddit feedback).

В v1.1 можно добавить strict-opt-in анонимный pingback «which features are used» — но это после того как Free-tier стабилизировался и есть baseline доверия.

---

## 10. Open questions / вещи которые нужно решить

- 🟡 Цена PRO — финал. Lifetime $14.99 vs $19.99 vs sub.
- 🟡 Нужно ли early-adopter pricing? (рекомендую да, $9.99 lifetime forever first 1000).
- 🟡 Templates — где UX-точка входа? Кнопка «From template» при создании доски, или отдельный таб?
- 🟡 Domain — kekkeys.com vs kekkeys.app vs оба. Проверить, занять.
- 🟡 Нужен ли в свободной (free) версии лимит на количество **кнопок** на доске? Сейчас неограничено. Я бы оставил как есть — это плохой artificial limit.
- 🟡 Нужен ли в десктопе индикатор «kekkeys is up to date» / автообновление-промпт? `electron-updater` подключён в плане, но не реализован.

---

## TL;DR

- **Технически готов**, но не для массового релиза. 2–3 недели работы до v1.0 — code signing, templates, иконки, демо-видео, onboarding.
- **Не лезть в feature creep.** Простота — единственный реальный диффер. Drag-to-move и пара мелких UX-фиксов — да. Toggle-кнопки, pages, action types — нет.
- **Монетизация:** Free должен быть полным, PRO = много досок + цвета + custom иконки. Lifetime $14.99 (или $9.99 для первых 1000). Без рекламы.
- **Маркетинг:** YouTube creator outreach + Reddit + Product Hunt — основной микс. SEO long-tail. Целевая аудитория — Wacom-юзеры и creators не-стримеры. Не лезть в стриминговую нишу — там Stream Deck.
- **Прибыль:** реалистично $10–20k за первый год при нормальном маркетинге. Не Touch Portal, но достойный side income.
- **Главный риск:** ниша меньше чем выглядит. Митигация — низкая cost-стуктура (один dev, no servers), быстрый release, измерять реальную traction по первым 1k установкам.
