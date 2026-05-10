# SEO-аудит kekkeys.online

Дата: 2026-05-10. Анализ: текущее состояние лендинга, сравнение с Touch Portal и прямыми конкурентами, рекомендации по семантике и структуре.

## 1. Что уже хорошо

Техническая обвязка лучше, чем у большинства инди-конкурентов:

- **5 локалей** (en/ru/es/de/ja) с правильными `hreflang` через `alternates.languages` и `x-default → /en/`. Touch Portal вообще не имеет языковых версий — это форточка для нас на DE/JA/ES рынках, где у них органики нет.
- **Sitemap + robots** статически генерируются, в sitemap прописаны alternates на каждую страницу.
- **JSON-LD `SoftwareApplication`** с `offers` (Free + PRO $9.99), `operatingSystem`, `applicationCategory`. Это даёт rich card в SERP.
- **Open Graph + Twitter card** с 1200×630 — превью в соцсетях нормальные.
- **Канонические URL** на каждой странице через `alternates.canonical`.
- **Полный набор иконок** (favicon, apple-touch, android-chrome 192/512), `manifest`.

## 2. Что не работает / упускаем трафик

### 2.1. H1 и hero не содержат ключевые слова, по которым ищут

Сейчас H1: «Your phone is your hotkey deck» / «Твой телефон — это твой хоткей-дек».

Проблема: «hotkey deck» / «хоткей-дек» — это **не запросы**. В Google и Яндексе люди ищут:

| Запрос (EN)                            | Конкуренция | Намерение |
| -------------------------------------- | ----------- | --------- |
| `stream deck alternative`              | высокая     | покупка   |
| `stream deck for phone` / `on phone`   | средняя     | покупка   |
| `stream deck app android`              | средняя     | установка |
| `phone as stream deck`                 | низкая      | установка |
| `free macropad app`                    | низкая      | установка |
| `touch portal alternative`             | низкая      | покупка   |
| `macro deck alternative`               | очень низкая| установка |
| `obs hotkey phone` / `photoshop hotkeys phone` | низкая | задача    |

| Запрос (RU)                                       | Намерение |
| ------------------------------------------------- | --------- |
| `стрим дек на телефоне` / `стрим дек на телефон`  | установка |
| `аналог стрим дек` / `альтернатива stream deck`   | покупка   |
| `макропад приложение` / `программа макропад`      | установка |
| `приложение для стрима с телефона` (большой объём, но шире нашей ниши) | установка |
| `как сделать стрим дек из телефона`               | how-to    |
| `хоткеи для photoshop с телефона`                 | задача    |

Сейчас в title и description **ни на одном языке** мы прямо не говорим «Stream Deck alternative» / «аналог Stream Deck» / «free Touch Portal alternative». Touch Portal в своём H1 пишет буквально: *«Touch Portal — Remote macro control deck for Windows, macOS and Linux»* — он ловит и `remote control deck`, и `macro deck`, и `windows`, и `macos`. Их title — это ключевая фраза в чистом виде.

### 2.2. Только лендинг, нет контента под long-tail

Сайт = `/`, `/download`, `/privacy`. Точка. **Ни одной статьи**. Конкуренты живут в выдаче за счёт:

- Macro Deck: документация + блог + GitHub README, который индексируется.
- Touch Portal: огромный список плагинов (OBS, Discord, Spotify, Photoshop…) — каждый плагин = отдельная страница и отдельный keyword bucket.
- Statьи-обзоры на okeygeek, kakichem, lifehacker, makeuseof — они забирают весь трафик по «как сделать стрим дек из телефона».

Без контентных страниц мы можем ранжироваться только по бренд-запросу `kekkeys`. По всему остальному — нет шансов.

### 2.3. Слово «macropad» есть в `keywords`, но не в видимом тексте

Google игнорирует `<meta keywords>`. Яндекс смотрит, но слабее, чем сам контент. Слово «macropad» / «макропад» **должно быть в H1, H2 или первом параграфе**, иначе мы по нему не ранжируемся.

### 2.4. Бренд `kekkeys` — рискованно для EN/DE

«kek» в англоязычном интернет-сленге = «lol» (StarCraft/4chan), плюс на немецком — фекалии (детский язык). Не блокер, но:
- невозможно ранжироваться по бренду-конкуренту (никто не знает имя),
- усложняет PR в EN-сегменте.

Решение не в смене бренда, а в том, чтобы **не полагаться на бренд-трафик**, а ловить generic-запросы.

### 2.5. Нет упоминания целевых приложений в H2/H3

Touch Portal в H2 перечисляет: *OBS, Streamlabs, XSplit, Twitch, Photoshop, Lightroom, Discord, Spotify…* — каждое имя = матч с long-tail-запросом `[app name] hotkeys` / `[app name] stream deck`.

У нас в `keywords` есть «hotkeys for photoshop / animate / blender / davinci resolve / obs», но в видимом тексте — только общие фразы «for digital artists, animators, video editors». Поисковик не видит конкретных названий продуктов.

### 2.6. Нет FAQ / Schema FAQPage

FAQPage даёт расширенный сниппет в Google и забирает зону под основной выдачей. У нас сейчас три фичи + три шага — этого мало для FAQ-rich-result.

### 2.7. Нет аналитики

В privacy явно написано «no cookies, no analytics». Это сильный месседж для аудитории, но **мы не видим ни одного запроса, по которому к нам приходят**. Слепое продвижение.

Компромисс: Plausible / Umami / self-hosted без cookies — формально не противоречит политике (нет персональных данных, нет fingerprint). Либо хотя бы Search Console (server-side, не трогает посетителя).

### 2.8. RU-meta-description не использует ключи

Текущий RU description:
> «Программируемый хоткей-дек на экране телефона. Бесплатный, локальный, без облака…»

Слов «макропад», «стрим дек», «аналог», «альтернатива», «Stream Deck» в нём нет. Это самые жирные RU-запросы — и мы их не цепляем.

## 3. Сравнение с Touch Portal

| Параметр                    | kekkeys                                 | Touch Portal                                      |
| --------------------------- | --------------------------------------- | ------------------------------------------------- |
| H1 содержит ключевик        | нет («hotkey deck» — не запрос)         | да («macro control deck for Windows…»)            |
| Локализация лендинга        | 5 языков с hreflang                     | только EN                                         |
| Список интеграций на главной| общие категории (артисты, монтажёры…)   | поимённо: OBS, Photoshop, Discord, Spotify, …    |
| JSON-LD                     | SoftwareApplication + offers            | базовый                                           |
| Цена                        | $9.99 PRO lifetime                      | $13.99 Pro + допы (Multiple Devices, иконки…)     |
| Контентные страницы         | 0                                       | плагины-страницы + форум + база знаний            |
| Платформы хоста             | Windows                                 | Windows + macOS + Linux                           |
| Платформы клиента           | Android (iOS — нет)                     | Android + iOS                                     |

**Где мы выигрываем:** локализация, чистая privacy-история (real local, no telemetry), цена. **Где проигрываем:** охват платформ, контентная воронка, узнаваемость бренда, видимость в SERP.

## 4. Прямые конкуренты в выдаче (что выпадает по нашим запросам)

Топ-5 имён, которые забирают наш потенциальный трафик:

1. **Elgato Stream Deck Mobile** — официальное приложение, $2.99/мес. Бренд-локомотив.
2. **Macro Deck** — open-source, бесплатный, с активным GitHub. Главный free-конкурент.
3. **Touch Portal** — описан выше.
4. **Deckboard** — Android-only, Indonesia, OBS-фокус. Бесплатное ядро.
5. **MATRIC** — много шаблонов, OBS-фокус.

В RU-сегменте топ выдачи по «стрим дек на телефоне» — это **обзорные статьи на okeygeek, kakichem, hipolink, lifehacker**. Они описывают Macro Deck и Stream Deck Mobile. Чтобы попасть в эти статьи, нужен outreach к авторам — отдельная задача за рамками SEO лендинга.

## 5. Резолюция: что конкретно делать

Приоритет = ROI на единицу работы. Сначала то, что меняется в одном файле и даёт прирост видимости.

### P0 — сделать сегодня, ничего не ломая (правки в `content.ts` + `layout.tsx`)

1. **Переписать title и description во всех локалях** так, чтобы там были генерик-ключи. Примеры:
   - EN: `kekkeys — phone Stream Deck alternative · free programmable macropad for Windows`
   - RU: `kekkeys — стрим дек на телефоне, программируемый макропад для Windows · бесплатно`
   - DE: `kekkeys — Stream-Deck-Alternative fürs Handy · Macropad-App für Windows`
2. **Добавить в первый параграф hero фразы-якоря** на каждом языке: «Stream Deck alternative», «Touch Portal alternative», «free macropad app», «макропад», «аналог Stream Deck». Текущий ходовой тон сохранить, просто вставить эти якоря в первое предложение или подзаголовок.
3. **Добавить в features список целевых приложений по именам**, как у Touch Portal: «Built for Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Animate, Figma…». В текущей формулировке этих слов нет.
4. **Поправить H2 features** — сейчас «A programmable hotkey deck for every app you live in». Заменить на что-то типа «A free Stream Deck alternative — controlled from your phone» / «Бесплатная альтернатива Stream Deck — управляешь с телефона». Это самый видимый H2.

### P1 — на этой неделе

5. **FAQ-секция** на главной (5–8 вопросов) + JSON-LD `FAQPage`. Вопросы под реальные запросы:
   - «Is kekkeys a free Stream Deck alternative?»
   - «Does it work with OBS / Photoshop / Blender?»
   - «Do I need to buy a Stream Deck device?»
   - «Чем отличается от Touch Portal / Macro Deck?»
   - «Можно ли использовать как макропад без покупки железа?»
6. **Подключить Search Console** для en и ru-доменов — без аналитики на клиенте, чтобы видеть реальные запросы и CTR. Это server-side, не противоречит политике.
7. **Добавить страницы интеграций** под формат `/{locale}/for/photoshop/`, `/for/obs/`, `/for/blender/`. Каждая = 300–500 слов, скриншот доски, таргет-ключ типа «photoshop hotkeys phone». Это и есть тот контент, по которому мы можем ранжироваться без блога.

### P2 — позже

8. **Блог / changelog раздел.** Хотя бы 1 пост в месяц с разбором use-case (например: «Building a Photoshop board: 12 hotkeys I use daily»). Это медленный, но единственный честный путь к organic traffic без бренда.
9. **Outreach к авторам обзоров на okeygeek/kakichem/lifehacker** + xda/makeuseof в EN. Они уже ранжируются — попасть в их сравнительные таблицы важнее, чем самим писать SEO-статьи.
10. **iOS-клиент.** Половина EN-запросов «stream deck for phone» подразумевает iPhone. Без iOS мы автоматически отсекаем эту аудиторию + теряем шанс на App Store SEO.
11. **Подпись кода для Windows + Google Play релиз.** Не SEO, но поисковики (особенно Google) учитывают сигналы доверия — Play-листинг даёт ссылку с высоким авторитетом и забирает часть запросов «kekkeys android».

## 6. Реальные данные Wordstat (RU)

Снято через залогиненный браузер 2026-05-10, период 07.04.2026 – 06.05.2026, регион «Все», все устройства. Цифра = показов в месяц.

### 6.1. Жирные ключи (head terms)

| Запрос                          | /мес   | Комментарий |
| ------------------------------- | ------ | ----------- |
| `stream deck` (латиница)        | 4 442  | **главный ключ**, латиница доминирует над кириллицей |
| `стрим дек` (кириллица)         | 2 130  | вторая по объёму запись бренда |
| `программируемая клавиатура`    | 1 356  | **сюрприз** — большой ключ, который мы вообще не используем |
| `elgato stream deck`            | 1 167  | бренд-локомотив, рядом стоять сложно |
| `стримдек` (слитно)             | 953    | забываемый паттерн, но почти 1000 показов |
| `streamdeck` (слитно, латиница) | 744    | то же на латинице |
| `макропад`                      | 572    | живой ключ, но в long-tail почти ноль |
| `touch portal`                  | 335    | прямой конкурент по бренду |
| `macro deck`                    | 269    | прямой конкурент по бренду |
| `ассистент клавиатуры`          | 197    | соседняя ниша (системный) |

### 6.2. Целевые long-tail с правильным intent

| Запрос                              | /мес | Intent |
| ----------------------------------- | ---- | ------ |
| `стрим дек ajazz` / `фифайн`        | 76 / 69 | железо, не наше |
| `стрим дек скачать`                 | 67   | **install** — наш |
| `как подключить стрим дек`          | 62   | задача |
| `stream deck mobile`                | 54   | **наш** — мобильный таргет |
| `как сделать стрим дек`             | 48   | DIY — **наш** |
| `плагины для стрим дек`             | 41   | расширения |
| `стрим дек приложение`              | 35   | **install — наш** |
| `стрим дек из телефона`             | 29   | **DIY мобайл — наш** |
| `стрим дек аналоги`                 | 20   | **сравнение — наш** |
| `как сделать из телефона стрим дек` | 19   | **точно наш pitch** |
| `эльгато стрим дек`                 | 19   | бренд |
| `стрим дек на телефон`              | 17   | **наш** |
| `стрим дек своими руками`           | 17   | **DIY — наш** |
| `программируемый макропад`          | 17   | **наш** |
| `программа для хоткеев`             | 15   | софт-сегмент |
| `пульт для obs`                     | 10   | OBS-аудитория |
| `хоткеи для blender / davinci / obs`| 5–7  | очень узко, можно игнорить |
| `макропад приложение / для пк`      | 3 / 4 | странно низко |

### 6.3. Что оказалось мусором (нулёвки)

| Запрос                              | /мес |
| ----------------------------------- | ---- |
| `альтернатива стрим дек`            | 0    |
| `хоткей пад`                        | 0    |
| `хоткеи для photoshop`              | 0    |
| `управление обс с телефона`         | 0    |
| `бесплатный стрим дек`              | 1    |

### 6.4. Что меняется в рекомендациях с учётом цифр

1. **Кириллица не доминирует** — `stream deck` (4442) почти в 2× больше, чем `стрим дек` (2130). В RU-копии **держим обе формы**, но «stream deck» латиницей должна быть в title и/или H1.
2. **Слово «альтернатива» — выкинуть.** Никто так не пишет. Использовать **«аналог»** (`аналог стрим дек` = 20, и в SERP по нему ранжируются обзорные статьи).
3. **«Программируемая клавиатура» — добавить как H2.** 1356 показов, мы под этот запрос не стоим вообще, конкуренция в выдаче — в основном железо, мы можем зайти как software.
4. **Добавить варианты написания:** `стримдек` слитно (953) и `streamdeck` слитно (744). Можно как noscript-текст или в alt-атрибуты, либо в FAQ-ответы.
5. **«Макропад» оставить, но не как главный ключ.** Слово знают (572), но long-tail почти пустой — значит, оно используется как описательное, а не для поиска готового решения.
6. **Drop план «страницы под Photoshop/OBS/Blender hotkeys».** В RU спрос ноль или 5–7. Если делать страницы интеграций — то с акцентом «{приложение} + Stream Deck», а не «hotkeys for {приложение}».
7. **DIY-угол (`как сделать стрим дек`, `своими руками`, `из телефона`)** — суммарно ~80 показов. Хороший контент-крючок для блога: одна статья «Как сделать стрим дек из телефона за 5 минут» закрывает 4 long-tail сразу.
8. **`стрим дек скачать` (67) + `стрим дек приложение` (35) + `стрим дек на телефон` (17)** — это наша основная навигационная зона. Лендинг должен матчиться под все три **формулировкой в title**.

### 6.5. Что Wordstat не даёт

- **EN/DE/ES/JA-объёмы.** Wordstat показывает только Яндекс-рынок. Для остальных локалей нужен Google Keyword Planner (требует Ads-аккаунта) или Ahrefs / Semrush / Ubersuggest. Ahrefs Keyword Generator даёт ~10 ключей бесплатно в день — годится для exploratory.
- **Конкуренцию в выдаче.** Wordstat — это спрос. Сложность ранжирования смотрится в Ahrefs / Mozbar.

### 6.6. Готовый шаблон title/description под цифры

EN — пока без замеров, по интуиции SERP:
```
title: kekkeys — phone Stream Deck alternative · free programmable macropad for Windows
desc:  Turn your phone into a free Stream Deck — programmable macropad for OBS, Photoshop, Blender, DaVinci, Premiere. Local, no cloud, no account.
```

RU — на основе данных выше:
```
title: kekkeys — Stream Deck на телефоне · бесплатный программируемый макропад для Windows
desc:  Сделай из телефона аналог Stream Deck. Программируемая клавиатура для OBS, Photoshop, Blender, DaVinci. Бесплатно, локально, без облака и аккаунта.
```

Ключи в этих двух предложениях, под которые мы матчимся:
- `Stream Deck` (4442), `Stream Deck на телефоне` (17), `аналог Stream Deck` (20),
- `программируемая клавиатура` (1356), `программируемый макропад` (17), `макропад` (572),
- `сделать из телефона стрим дек` (19), `стрим дек скачать` (67) — через мета-описание + CTA «Скачать».

## Источники

- [Touch Portal landing](https://www.touch-portal.com/)
- [Macro Deck (Google Play)](https://play.google.com/store/apps/details?id=com.suchbyte.macrodeck)
- [Macro Deck site](https://macro-deck.app/)
- [TouchPortal alternatives — AlternativeTo](https://alternativeto.net/software/touchportal/)
- [Best Stream Deck alternatives 2026 — Gumlet](https://www.gumlet.com/learn/stream-deck-alternatives/)
- [Аналог Elgato Stream Deck — okeygeek](https://okeygeek.ru/besplatnyjj-analog-elgato-stream-deck-prilozhenie-macro-deck/)
- [Как сделать из телефона стрим дек — kakichem](https://kakichem.ru/kak-sdelat-iz-telefona-ili-plansheta-besplatnyj-strim-dek-dlya-upravleniya-kompyuterom-i-strimami/)
- [I turned my Android into a Stream Deck — MakeUseOf](https://www.makeuseof.com/i-turned-my-android-into-a-stream-deck-free/)
- [Yandex Wordstat](https://wordstat.yandex.ru/)
- [Google Trends](https://trends.google.com/)

## 7. Реальные данные Google Trends (EN, worldwide)

Снято 2026-05-10, период «За 12 мес.», регион «По всему миру». Цифра = средний интерес за период по нормировке Google Trends (peak в каждом батче = 100). Сравнения межбатчевые делаются через якорный термин.

### 7.1. Head terms (батч-якорь = `stream deck`)

| Запрос               | Avg | Замечание |
| -------------------- | --- | --------- |
| `stream deck`        | 52  | абсолютный head |
| `touch portal`       | 7   | прямой конкурент, ~13% от стрим дек |
| `macropad`           | 2   | **почти не ищут** |
| `macro pad` (раздельно) | 2 | то же |
| `hotkey deck`        | 0   | **не запрос** — наш бывший H1 |

### 7.2. Phone-варианты (якорь = `stream deck app`)

| Запрос                      | Avg | Замечание |
| --------------------------- | --- | --------- |
| `stream deck app`           | 62  | **главный phone-related ключ** |
| `stream deck mobile`        | 28  | вторая по силе формулировка |
| `stream deck alternative`   | 18  | alternative-кластер |
| `deckboard`                 | 18  | прямой конкурент |
| `stream deck android`       | 16  | Android-таргет |
| `obs hotkeys`               | 12  | **app-specific крючок №1** |
| `phone stream deck`         | 8   | разговорная форма, средняя |
| `blender hotkeys`           | 8   | app-specific |
| `stream deck for phone`     | 8   | то же намерение, что mobile |
| `stream deck cheap`         | 7   | buyer-intent |
| `macro deck app`            | 2   | конкурент |
| `photoshop hotkeys`         | 1   | **сюрприз — не ищут** |
| `touch portal alternative`  | 1   | **мёртвый ключ** |
| `phone as stream deck`      | 0   | **0 интереса** |
| `turn phone into stream deck` | 0 | **0 интереса** |
| `phone macro pad`           | 1   | мёртвый |
| `davinci hotkeys`           | 0   | мёртвый |
| `free macropad`             | 0   | мёртвый |
| `macropad app`              | 0   | мёртвый |

### 7.3. Free / buyer-intent (якорь = `stream deck app`)

| Запрос                  | Avg |
| ----------------------- | --- |
| `stream deck app`       | 62  |
| `free stream deck`      | 36  | **жирный buyer-intent ключ** |
| `stream deck cheap`     | 7   |
| `free macropad`         | 0   |

### 7.4. Что меняется в EN-копии после Google Trends

1. **Главный EN-ключ — `stream deck app`, не `phone Stream Deck alternative`.** Он в 3.4× жирнее `stream deck alternative` и в 7.7× жирнее `phone stream deck`. Title должен начинаться с него.
2. **«Macropad» в EN — почти мусор.** В RU он живой (572), в EN — 2 балла на фоне 52 у `stream deck`. Из EN-title и EN-H1 убрать. Оставить как вспомогательное слово в body.
3. **«Hotkey deck» — мёртв полностью.** Это был наш текущий H1 («your phone is your hotkey deck»). По нему **нельзя ранжироваться, потому что его не ищут**. Поменять.
4. **`free stream deck` (36) — самый сильный аргумент в EN-positioning.** Слово **free** должно стоять в title и в первом параграфе hero. Это единственная точка, где мы реально побеждаем железный Stream Deck — он не бесплатный.
5. **`obs hotkeys` (12) и `blender hotkeys` (8) живые** — стоит сделать страницы интеграций под OBS и Blender. Photoshop / DaVinci — нет смысла, спрос ноль.
6. **`touch portal alternative` мёртв** — никто не ищет «Touch Portal alternative», ищут просто `touch portal` (брендовый трафик идёт к ним) или `stream deck alternative` (общий). Не пихать «Touch Portal alternative» в копию.
7. **«Phone as stream deck», «turn phone into stream deck» — тоже нули.** Это интуитивные формулировки, но Google Trends говорит — так не пишут. Использовать `stream deck app for android`, `mobile stream deck` — реальные паттерны.

### 7.5. Финальные шаблоны title/desc под цифры

EN — пересмотренный с учётом Trends:
```
title: kekkeys — free Stream Deck app for Android · turns your phone into a programmable deck
desc:  Free Stream Deck app for your phone. Programmable deck for OBS, Blender,
       Premiere, Animate. Local pairing, no cloud, no account. Open the app, scan a QR.
```

Ключи в этом title/desc, под которые матчимся:
- `stream deck app` (62) — head в title,
- `free stream deck` (36) — модификатор в title и desc,
- `stream deck android` (16) — Android в title,
- `stream deck mobile` (28) — через «for your phone» в desc,
- `stream deck alternative` (18) — частично через «turns your phone into a deck»,
- `obs hotkeys` (12) — через перечисление приложений,
- `blender hotkeys` (8) — то же.

RU — финальный (без изменений с секции 6.6):
```
title: kekkeys — Stream Deck на телефоне · бесплатный программируемый макропад для Windows
desc:  Сделай из телефона аналог Stream Deck. Программируемая клавиатура для OBS,
       Photoshop, Blender, DaVinci. Бесплатно, локально, без облака и аккаунта.
```

### 7.6. Что стоит признать честно

- Google Trends даёт **относительные** числа, не абсолютные. Для абсолютных EN-объёмов нужен Google Keyword Planner (Ads-аккаунт) или Ahrefs.
- DE / ES / JA не покрыты ни Wordstat'ом, ни этим срезом Trends. Если они приоритетны — нужен отдельный заход через Trends с региональным фильтром.
- 12-месячное окно сглаживает сезонность. Stream Deck — пик к Black Friday и каникулам. На этот таймлайн стоит планировать релизы.

## 8. DE и JA через Google Trends

Тот же метод, регион `geo=DE` и `geo=JP`, период «За 12 мес.».

### 8.1. DE (Germany)

| Запрос                  | Avg | Замечание |
| ----------------------- | --- | --------- |
| `stream deck`           | 65  | абсолютный head, как и везде |
| `elgato stream deck`    | 19  | бренд-уточнение |
| `touch portal`          | 3   | конкурент, маленький |
| `stream deck app`       | 1   | **почти не ищут** |
| `stream deck alternative` | 0 | мёртв |
| `stream deck mobile`    | 0   | мёртв |
| `stream deck android`   | 0   | мёртв |
| `stream deck handy`     | 0   | мёртв (Handy = телефон по-немецки) |
| `Makropad`              | 0   | мёртв |
| `Tastatur programmierbar` | 0 | мёртв |
| `Hotkey Tastatur`       | 0   | мёртв |
| `macro deck`            | 0   | мёртв |

**Вывод по DE.** Рынок маленький и брендозависимый. Народ ищет либо `stream deck`, либо `elgato stream deck`. Variant-запросы (app/mobile/handy/alternative) и немецкие кальки (Makropad, Tastatur programmierbar) — все близко к нулю. Вкладывать ресурсы в полноценную DE-семантику невыгодно. Достаточно держать сам факт DE-локали (мы уже её держим — это плюс к hreflang) и **в title упомянуть `Stream Deck` латиницей** — это всё, что можно реально таргетить.

### 8.2. JA (Japan)

| Запрос                          | Avg | Замечание |
| ------------------------------- | --- | --------- |
| `stream deck` (латиница)        | 63  | head |
| `ストリームデック` (катакана)   | 33  | вторая по силе, ~50% |
| `touch portal`                  | 1   | мёртв |
| `macro deck`                    | 0   | мёртв |
| `マクロパッド` (макропад)       | 0   | мёртв |
| `stream deck app`               | 0   | мёртв |
| `stream deck mobile`            | 0   | мёртв |
| `ストリームデック アプリ` (стримдек app) | 0 | мёртв |
| `ストリームデック スマホ` (стримдек смартфон) | 0 | мёртв |

**Вывод по JA.** Спрос только на бренд в двух написаниях. `Stream Deck` латиницей в 2× жирнее катаканы — но катакана тоже **должна** присутствовать, иначе мы не матчимся под ~⅓ рынка. Хвостов нет вообще, как и в DE.

### 8.3. Финальные шаблоны title/desc для DE и JA

DE:
```
title: kekkeys — kostenlose Stream Deck App fürs Handy · für Windows
desc:  Verwandle dein Handy in ein Stream Deck. Programmierbares Hotkey-Deck für
       OBS, Blender, Photoshop. Lokal, ohne Cloud, ohne Konto.
```

JA — обязательно держим обе формы, латиницу ставим первой:
```
title: kekkeys — Stream Deck（ストリームデック）アプリ · スマホがホットキーデックに
desc:  あなたのスマホを Stream Deck に。OBS、Blender、Photoshop 用のプログラマブルな
       ホットキーデック。ローカルで動作、クラウド不要、アカウント不要、無料。
```

### 8.4. Стратегический вывод по локалям

- **EN и RU — основные рынки**, есть и head-, и хвостовой спрос, оправдан полноценный SEO-разворот (title/desc/H1/H2/FAQ/страницы интеграций).
- **DE и JA — поддерживающие локали**: рынки маленькие, спрос концентрированно брендовый. Достаточно обновить title/desc, держать hreflang. Не тратить ресурсы на статьи, страницы интеграций, FAQ-локализацию — окупаемость низкая.
- **ES** — не проверял через Trends отдельно, паттерн скорее всего как DE/JA (англицизм `stream deck` доминирует, локальные кальки — ноль). Если интересует, дёрну отдельно.
