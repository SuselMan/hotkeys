/**
 * Shared content for both locales. Each page imports its locale's bundle
 * (en or ru) and wires it into the shared layout components.
 */
export interface LandingContent {
  nav: {
    home: string;
    download: string;
    privacy: string;
  };
  hero: {
    headline: string;
    lead: string;
    ctaWindows: string;
    ctaWindowsSub: string;
    ctaApk: string;
    ctaApkSub: string;
  };
  features: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; body: string }>;
  };
  steps: {
    eyebrow: string;
    title: string;
    items: Array<{ body: string; sub: string }>;
  };
  download: {
    title: string;
    intro: string;
    windowsTitle: string;
    windows: string[];
    windowsCallout: string;
    androidTitle: string;
    android: string[];
    androidCallout: string;
  };
  privacy: {
    title: string;
    body: string[];
  };
  footer: {
    copy: string;
    privacy: string;
    download: string;
  };
}

export const en: LandingContent = {
  nav: { home: "Home", download: "Download", privacy: "Privacy" },
  hero: {
    headline: "Your phone is your hotkey deck.",
    lead:
      "kekkeys turns your phone into a programmable hotkey deck for the apps you live in. Configure boards on the phone, press buttons, real keystrokes fire on your PC over local WiFi. Built for digital artists, animators, video editors, 3D modellers, streamers — anyone whose workflow runs on keyboard shortcuts.",
    ctaWindows: "Download for Windows",
    ctaWindowsSub: "Tray app, no install wizard",
    ctaApk: "Download APK",
    ctaApkSub: "Android · Google Play soon",
  },
  features: {
    eyebrow: "Why kekkeys",
    title: "A programmable hotkey deck for every app you live in.",
    items: [
      {
        title: "Configured entirely on your phone",
        body:
          "Pick any grid size, drag buttons onto the cells, choose from 3866 Material Symbols icons, set key combos with a visual builder. The desktop just listens and presses.",
      },
      {
        title: "Real keystrokes, not text input",
        body:
          "Press-and-hold a button — the actual keys stay down on the PC. Combos, modifiers, hand-tools, multi-touch. Works regardless of keyboard layout.",
      },
      {
        title: "Local-first, zero cloud",
        body:
          "Pairing happens over your WiFi via QR. No account, no telemetry, your secrets never leave the LAN. The desktop app stays in your tray.",
      },
    ],
  },
  steps: {
    eyebrow: "How it works",
    title: "Three steps. No accounts, no cloud.",
    items: [
      {
        body: "Install kekkeys on your PC and your phone.",
        sub: "Free, no account. Both devices on the same WiFi network — that's the whole setup.",
      },
      {
        body: "Open kekkeys on the desktop and scan the QR with your phone.",
        sub: "Pairing happens over your local WiFi. Nothing leaves the LAN.",
      },
      {
        body: "Build a board on the phone, tap a button — real keystrokes fire on your PC.",
        sub: "Tap or hold. Multi-touch sends chords. As many boards as you want, one per app.",
      },
    ],
  },
  download: {
    title: "Download",
    intro:
      "kekkeys is two apps: a tray app on Windows that fires keys, and a phone app you build boards in. Get both.",
    windowsTitle: "Windows",
    windows: [
      "Download the latest installer from the link below.",
      "Run it. SmartScreen will warn — click \"More info\" → \"Run anyway\".",
      "kekkeys appears in your system tray. Click the icon to open the QR.",
    ],
    windowsCallout:
      "Code-signing is on the roadmap. Until then, the SmartScreen warning is expected.",
    androidTitle: "Android",
    android: [
      "Download the APK from the link below.",
      "If your phone blocks unknown sources, allow it for the file manager you used.",
      "Open kekkeys, tap Scan QR, point at the desktop screen. Done.",
    ],
    androidCallout:
      "Google Play release pending validation. The APK is signed with a stable key, future updates can install over it.",
  },
  privacy: {
    title: "Privacy policy",
    body: [
      "kekkeys collects nothing. There are no servers. There is no telemetry.",
      "Your boards are stored on your phone. Pairing secrets are stored in the OS keystore on the phone and via DPAPI on Windows. Both stay local — they never travel further than your WiFi.",
      "Pairing data exchanged between phone and PC: phone name, key combinations the user pressed, timestamps. None of it is logged or transmitted off the LAN.",
      "There is no account. There is no \"forgot my password\" flow because we have no passwords.",
      "We do not use cookies or analytics on this site. Your visit here is not tracked.",
      "Material Symbols icons are © Google, distributed under Apache 2.0.",
      "If we change anything that affects this policy, this page is the source of truth and will be dated at the top.",
    ],
  },
  footer: {
    copy: "© kekkeys",
    privacy: "Privacy",
    download: "Download",
  },
};

export const ru: LandingContent = {
  nav: { home: "Главная", download: "Скачать", privacy: "Приватность" },
  hero: {
    headline: "Твой телефон — это твой хоткей-дек.",
    lead:
      "kekkeys превращает твой телефон в программируемый хоткей-дек для тех приложений, в которых ты живёшь. Настраиваешь доски с телефона, жмёшь кнопки — на ПК фигачат настоящие клавиши через твой WiFi. Сделан для художников, аниматоров, видеомонтажёров, 3D-моделлеров, стримеров — всех у кого работа на хоткеях.",
    ctaWindows: "Скачать для Windows",
    ctaWindowsSub: "Tray-приложение, без визарда",
    ctaApk: "Скачать APK",
    ctaApkSub: "Android · Google Play скоро",
  },
  features: {
    eyebrow: "Зачем kekkeys",
    title: "Программируемый хоткей-дек для каждого приложения.",
    items: [
      {
        title: "Полностью настраивается с телефона",
        body:
          "Сетка любого размера, кнопки перетаскиваешь куда нужно, 3866 иконок Material Symbols, визуальный билдер комбинаций с залипающими модификаторами. На ПК — компаньон, который ничего не настраивает.",
      },
      {
        title: "Настоящие клавиши, не текст",
        body:
          "Зажал кнопку на телефоне — клавиши держатся на ПК. Комбинации, модификаторы, hand-tool, мульти-тач. Работает независимо от раскладки.",
      },
      {
        title: "Локально, без облака",
        body:
          "Пейринг через QR в твоей WiFi-сети. Никаких аккаунтов, телеметрии, секреты не покидают LAN. Десктоп живёт в трее и не отсвечивает.",
      },
    ],
  },
  steps: {
    eyebrow: "Как это работает",
    title: "Три шага. Без аккаунтов и облака.",
    items: [
      {
        body: "Поставь kekkeys на ПК и на телефон.",
        sub: "Бесплатно, без аккаунтов. Подключи оба устройства к одной WiFi — это всё что нужно для настройки.",
      },
      {
        body: "Открой kekkeys на ПК и отсканируй QR с телефона.",
        sub: "Пейринг идёт через твою локальную WiFi. Ничего не уходит за пределы LAN.",
      },
      {
        body: "Собери доску на телефоне, тапни кнопку — на ПК срабатывают настоящие клавиши.",
        sub: "Тап или удержание. Мульти-тач — аккорд. Сколько угодно досок, по одной на приложение.",
      },
    ],
  },
  download: {
    title: "Скачать",
    intro:
      "kekkeys — это два приложения: tray для Windows и приложение телефона. Нужны оба.",
    windowsTitle: "Windows",
    windows: [
      "Скачай свежий инсталлер по ссылке ниже.",
      "Запусти. SmartScreen ругнётся — кликни «Подробнее» → «Выполнить в любом случае».",
      "kekkeys появится в трее. Кликни на иконку — откроется окно с QR.",
    ],
    windowsCallout:
      "Подпись кода — в роадмапе. Пока что предупреждение SmartScreen ожидаемо.",
    androidTitle: "Android",
    android: [
      "Скачай APK по ссылке ниже.",
      "Если телефон блокирует неизвестные источники — разреши для файлового менеджера откуда ставишь.",
      "Открой kekkeys, тап Scan QR, наведи на экран ПК. Готово.",
    ],
    androidCallout:
      "Релиз в Google Play — после валидации UX. Текущий APK подписан стабильным ключом, апдейты накатываются поверх.",
  },
  privacy: {
    title: "Политика приватности",
    body: [
      "kekkeys ничего не собирает. У нас нет серверов. Нет телеметрии.",
      "Доски хранятся на твоём телефоне. Pairing-секреты — в Android Keystore на телефоне и в DPAPI на Windows. Всё локально, ничего не уходит за пределы твоей WiFi-сети.",
      "Между телефоном и ПК передаётся: имя телефона, нажатые комбинации, временные метки. Ничего из этого не логируется и не выходит из LAN.",
      "Нет аккаунтов. Нет «восстановить пароль» потому что нет паролей.",
      "На сайте нет cookies и аналитики. Твой визит сюда не трекается.",
      "Иконки Material Symbols — © Google, лицензия Apache 2.0.",
      "Если что-то поменяется в этой политике, эта страница — источник истины, дата изменений будет наверху.",
    ],
  },
  footer: {
    copy: "© kekkeys",
    privacy: "Приватность",
    download: "Скачать",
  },
};

export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const content: Record<Locale, LandingContent> = { en, ru };
