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

## 6. Про Яндекс Wordstat

Wordstat **требует логина в Яндекс**. WebFetch не может его обойти — данные за пейволлом. Что можно сделать:

- **Ручная проверка**: зайти на https://wordstat.yandex.ru/ под своим аккаунтом и пробить список ключей из таблицы выше. Сохранить цифры и приоритизировать по объёму. Это 15 минут работы.
- **Альтернативы без логина**:
  - **Google Trends** (https://trends.google.com/) — бесплатно, без логина, показывает относительный объём и сравнение запросов между собой. Хорош для понимания «макропад» vs «стрим дек» vs «hotkey deck».
  - **Just-Magic, Букварикс, Mutagen** — RU-парсеры Wordstat с бесплатным лимитом.
  - **Keyword Tool** (keywordtool.io) — даёт варианты long-tail без объёмов в free-tier.
  - **Ahrefs Keyword Generator** (https://ahrefs.com/keyword-generator) — 100 ключей в день бесплатно, с приблизительным объёмом.

Если хочешь, я могу:
- собрать список из 30–50 ключей под наш профиль и подготовить таблицу для ручной проверки в Wordstat;
- прогнать ключи через Google Trends через WebFetch и собрать сравнительные срезы.

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
