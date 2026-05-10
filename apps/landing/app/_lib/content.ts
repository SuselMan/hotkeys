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
  faq: {
    eyebrow: string;
    title: string;
    items: Array<{ q: string; a: string }>;
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
    headline: "Your phone is a free Stream Deck.",
    lead:
      "kekkeys is a free Stream Deck app for your phone — turns your Android device into a programmable deck for the Windows apps you live in. Configure boards on the phone, press buttons, real keystrokes fire on your PC over local WiFi. Built for OBS, Blender, Premiere, Animate, Figma, After Effects — and any keyboard-shortcut workflow.",
    ctaWindows: "Download for Windows",
    ctaWindowsSub: "Tray app, no install wizard",
    ctaApk: "Coming to Google Play",
    ctaApkSub: "Android · review pending",
  },
  features: {
    eyebrow: "Why kekkeys",
    title: "A free Stream Deck app — your phone is the deck.",
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
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        q: "Is kekkeys a free Stream Deck alternative?",
        a: "Yes. Free supports one board on one paired PC with all core features — drag-drop builder, key combos, multi-touch, sticky modifiers. PRO is a one-time $9.99 purchase that unlocks unlimited boards, custom button colors, custom uploaded icons, and multi-PC pairing. There is no subscription.",
      },
      {
        q: "Do I need a Stream Deck device or any other hardware?",
        a: "No. kekkeys runs entirely on your phone and your Windows PC — no Elgato hardware, no USB peripheral, no extra device. Your phone screen is the deck.",
      },
      {
        q: "Which apps does it work with?",
        a: "Any Windows app that uses keyboard shortcuts. We've tested with Photoshop, Animate, Blender, DaVinci Resolve, OBS, Figma, Premiere, After Effects, Krita, Lightroom, ToonBoom, and many more. If the app responds to a hotkey on your physical keyboard, kekkeys can fire it.",
      },
      {
        q: "Do my keystrokes go through the cloud?",
        a: "No. kekkeys uses a direct connection between your phone and PC over your local WiFi. Pairing is done with a QR code; secrets are stored in the OS keystore (Android Keystore on the phone, DPAPI on Windows). Nothing leaves your LAN.",
      },
      {
        q: "Can I send chords or held modifiers?",
        a: "Yes. Two fingers on the phone send chords like Ctrl+Shift+Z. There's also a Sticky toggle: tap once to press and hold a modifier (e.g. Shift), tap again to release. Works for any combination.",
      },
      {
        q: "Is there a Mac or Linux desktop version? Or iOS?",
        a: "Not for v1.0 — desktop is Windows 10/11 only, phone is Android only. macOS, Linux, and iOS are on the roadmap for future releases.",
      },
      {
        q: "Does kekkeys collect any data or telemetry?",
        a: "No. There are no servers, no analytics, no telemetry, no tracking. We don't have a backend at all — boards and keystrokes never leave your local network. The privacy page on this site spells out the full picture.",
      },
      {
        q: "What happens if I lose my phone or reinstall the app?",
        a: "Boards are stored on the phone, so a fresh install starts empty. Use Export to JSON in Settings for periodic backups. PRO entitlement is tied to your Google account — tap Restore purchases on the Upgrade screen and PRO comes back without paying again.",
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
      "Submitted to Google Play. Approval pending.",
      "Once live, install kekkeys from Google Play.",
      "Open kekkeys, tap Scan QR, point at the desktop screen. Done.",
    ],
    androidCallout:
      "We'll publish the Google Play link here as soon as the app is approved.",
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
    headline: "Твой телефон — это Stream Deck.",
    lead:
      "kekkeys — бесплатный Stream Deck на телефоне, программируемая клавиатура для Windows-приложений, в которых ты живёшь. Настраиваешь доски с телефона, жмёшь кнопки — на ПК фигачат настоящие клавиши через твой WiFi. Сделан для OBS, Photoshop, Blender, DaVinci, Premiere, After Effects, Animate, Figma — и любого хоткей-сценария. Аналог Stream Deck без покупки железа.",
    ctaWindows: "Скачать для Windows",
    ctaWindowsSub: "Tray-приложение, без визарда",
    ctaApk: "Скоро в Google Play",
    ctaApkSub: "Android · на проверке",
  },
  features: {
    eyebrow: "Зачем kekkeys",
    title: "Программируемая клавиатура на телефоне — аналог Stream Deck.",
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
  faq: {
    eyebrow: "FAQ",
    title: "Частые вопросы",
    items: [
      {
        q: "kekkeys — это бесплатный аналог Stream Deck?",
        a: "Да. Free поддерживает одну доску на одном спаренном ПК со всеми основными возможностями — drag-drop билдер, комбинации клавиш, мульти-тач, sticky-модификаторы. PRO — разовая покупка $9.99, снимает ограничения: безлимитные доски, кастомные цвета кнопок, свои иконки, мульти-ПК пейринг. Подписки нет.",
      },
      {
        q: "Нужно ли покупать Stream Deck или какое-то железо?",
        a: "Нет. kekkeys работает только на твоём телефоне и Windows-ПК — никакого железа от Elgato, никакого USB-устройства. Экран телефона и есть дек.",
      },
      {
        q: "С какими приложениями работает?",
        a: "С любыми Windows-приложениями, которые используют горячие клавиши. Тестировали с Photoshop, Animate, Blender, DaVinci Resolve, OBS, Figma, Premiere, After Effects, Krita, Lightroom, ToonBoom и многими другими. Если приложение реагирует на хоткей с физической клавиатуры — kekkeys его пошлёт.",
      },
      {
        q: "Идут ли нажатия через облако?",
        a: "Нет. kekkeys использует прямое соединение телефон-ПК по локальной WiFi. Пейринг через QR-код, секреты в OS keystore (Android Keystore на телефоне, DPAPI на Windows). Ничего не покидает LAN.",
      },
      {
        q: "Можно ли слать аккорды или удерживать модификаторы?",
        a: "Да. Два пальца на телефоне шлют аккорды типа Ctrl+Shift+Z. Также есть Sticky-тоггл: один тап нажать и удерживать модификатор (например Shift), повторный тап — отпустить. Работает для любых комбинаций.",
      },
      {
        q: "Есть версия для Mac или Linux? А iOS?",
        a: "На v1.0 — десктоп только Windows 10/11, мобильное только Android. macOS, Linux и iOS в дорожной карте на будущие релизы.",
      },
      {
        q: "Собирает ли kekkeys какие-то данные или телеметрию?",
        a: "Нет. Серверов нет, аналитики нет, телеметрии нет, трекинга нет. У нас вообще нет бэкенда — доски и нажатия никогда не покидают локальную сеть. Полная картина — на странице приватности.",
      },
      {
        q: "Что если я потеряю телефон или переустановлю приложение?",
        a: "Доски хранятся на телефоне, после переустановки начнётся пусто. В Settings есть Export в JSON для периодического бэкапа. PRO привязан к Google-аккаунту — тапни «Восстановить покупки» на экране Upgrade и PRO вернётся без повторной оплаты.",
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
      "Отправлено на проверку в Google Play.",
      "Как только приложение одобрят, поставь его из Google Play.",
      "Открой kekkeys, тап Scan QR, наведи на экран ПК. Готово.",
    ],
    androidCallout:
      "Опубликуем ссылку на Google Play здесь как только приложение пройдёт проверку.",
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

export const es: LandingContent = {
  nav: { home: "Inicio", download: "Descargar", privacy: "Privacidad" },
  hero: {
    headline: "Tu teléfono es tu deck de hotkeys.",
    lead:
      "kekkeys es una alternativa gratis a Stream Deck en tu teléfono — un macropad programable para las apps de Windows en las que vives. Configura tableros desde el móvil, pulsa botones, las teclas reales se disparan en tu PC por WiFi local. Hecho para Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Animate, Figma — y cualquier flujo basado en atajos de teclado.",
    ctaWindows: "Descargar para Windows",
    ctaWindowsSub: "App en bandeja, sin asistente de instalación",
    ctaApk: "Próximamente en Google Play",
    ctaApkSub: "Android · revisión pendiente",
  },
  features: {
    eyebrow: "Por qué kekkeys",
    title: "Una alternativa gratis a Stream Deck — programable desde tu teléfono.",
    items: [
      {
        title: "Configurado por completo desde el móvil",
        body:
          "Elige el tamaño de la cuadrícula, arrastra botones a las celdas, escoge entre 3866 iconos de Material Symbols, asigna combinaciones con un editor visual. El escritorio solo escucha y pulsa.",
      },
      {
        title: "Pulsaciones reales, no entrada de texto",
        body:
          "Mantén un botón pulsado — las teclas reales quedan presionadas en el PC. Combos, modificadores, herramientas de mano, multitouch. Funciona sin importar la distribución del teclado.",
      },
      {
        title: "Local primero, cero nube",
        body:
          "El emparejamiento ocurre por tu WiFi vía QR. Sin cuenta, sin telemetría, tus secretos nunca salen de la LAN. La app de escritorio queda en la bandeja del sistema.",
      },
    ],
  },
  steps: {
    eyebrow: "Cómo funciona",
    title: "Tres pasos. Sin cuentas, sin nube.",
    items: [
      {
        body: "Instala kekkeys en tu PC y en tu móvil.",
        sub: "Gratis, sin cuenta. Ambos dispositivos en la misma red WiFi — esa es toda la configuración.",
      },
      {
        body: "Abre kekkeys en el escritorio y escanea el QR con tu móvil.",
        sub: "El emparejamiento ocurre por tu WiFi local. Nada sale de la LAN.",
      },
      {
        body: "Crea un tablero en el móvil, pulsa un botón — las teclas reales se disparan en tu PC.",
        sub: "Pulsa o mantén. El multitouch envía acordes. Tantos tableros como quieras, uno por app.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿kekkeys es una alternativa gratis a Stream Deck?",
        a: "Sí. Free admite un tablero en un PC emparejado con todas las funciones principales — editor visual, combinaciones de teclas, multitouch, modificadores sticky. PRO es una compra única de $9.99 que desbloquea tableros ilimitados, colores personalizados de botones, iconos propios y emparejamiento multi-PC. No hay suscripción.",
      },
      {
        q: "¿Necesito un Stream Deck u otro hardware?",
        a: "No. kekkeys funciona enteramente en tu teléfono y tu PC con Windows — sin hardware de Elgato, sin periféricos USB, sin dispositivo adicional. La pantalla de tu teléfono es el deck.",
      },
      {
        q: "¿Con qué apps funciona?",
        a: "Con cualquier app de Windows que use atajos de teclado. Probado con Photoshop, Animate, Blender, DaVinci Resolve, OBS, Figma, Premiere, After Effects, Krita, Lightroom, ToonBoom y muchas más. Si la app responde a un atajo desde tu teclado físico, kekkeys puede dispararlo.",
      },
      {
        q: "¿Las pulsaciones pasan por la nube?",
        a: "No. kekkeys usa una conexión directa entre tu teléfono y tu PC por tu WiFi local. El emparejamiento se hace con QR; los secretos se guardan en el keystore del SO (Android Keystore en el teléfono, DPAPI en Windows). Nada sale de tu LAN.",
      },
      {
        q: "¿Puedo enviar acordes o mantener modificadores pulsados?",
        a: "Sí. Dos dedos en el teléfono envían acordes tipo Ctrl+Shift+Z. También hay un toggle Sticky: pulsa una vez para mantener un modificador (ej. Shift), pulsa de nuevo para soltar. Funciona para cualquier combinación.",
      },
      {
        q: "¿Hay versión para Mac, Linux o iOS?",
        a: "No en v1.0 — escritorio solo Windows 10/11, móvil solo Android. macOS, Linux e iOS están en el roadmap para versiones futuras.",
      },
      {
        q: "¿kekkeys recopila datos o telemetría?",
        a: "No. No hay servidores, no hay analítica, no hay telemetría, no hay tracking. No tenemos backend — tableros y pulsaciones nunca salen de tu red local. La página de privacidad detalla todo.",
      },
      {
        q: "¿Qué pasa si pierdo mi teléfono o reinstalo la app?",
        a: "Los tableros se guardan en el teléfono, así que una reinstalación empieza vacía. Usa Exportar a JSON en Ajustes para hacer copia de seguridad. La compra PRO está ligada a tu cuenta de Google — pulsa Restaurar compras en la pantalla Upgrade y PRO vuelve sin pagar otra vez.",
      },
    ],
  },
  download: {
    title: "Descargar",
    intro:
      "kekkeys son dos apps: una de bandeja en Windows que dispara teclas, y una app de móvil donde construyes tableros. Necesitas las dos.",
    windowsTitle: "Windows",
    windows: [
      "Descarga el último instalador desde el enlace de abajo.",
      "Ejecútalo. SmartScreen advertirá — pulsa «Más información» → «Ejecutar de todas formas».",
      "kekkeys aparecerá en la bandeja del sistema. Pulsa el icono para abrir el QR.",
    ],
    windowsCallout:
      "La firma de código está en el roadmap. Hasta entonces, la advertencia de SmartScreen es esperada.",
    androidTitle: "Android",
    android: [
      "Enviado a Google Play. Revisión pendiente.",
      "Cuando esté disponible, instala kekkeys desde Google Play.",
      "Abre kekkeys, pulsa Escanear QR, apunta a la pantalla del PC. Listo.",
    ],
    androidCallout:
      "Publicaremos el enlace de Google Play aquí en cuanto la app sea aprobada.",
  },
  privacy: {
    title: "Política de privacidad",
    body: [
      "kekkeys no recopila nada. No hay servidores. No hay telemetría.",
      "Tus tableros se guardan en tu móvil. Los secretos de emparejamiento se guardan en el keystore del SO en el móvil y vía DPAPI en Windows. Ambos quedan locales — nunca viajan más allá de tu WiFi.",
      "Datos de emparejamiento intercambiados entre móvil y PC: nombre del móvil, combinaciones de teclas pulsadas, marcas de tiempo. Nada de eso se registra ni se transmite fuera de la LAN.",
      "No hay cuenta. No hay flujo de «recuperar contraseña» porque no hay contraseñas.",
      "No usamos cookies ni analítica en este sitio. Tu visita aquí no se rastrea.",
      "Los iconos de Material Symbols son © Google, distribuidos bajo Apache 2.0.",
      "Si cambiamos algo que afecte a esta política, esta página es la fuente de verdad y llevará la fecha en la parte superior.",
    ],
  },
  footer: {
    copy: "© kekkeys",
    privacy: "Privacidad",
    download: "Descargar",
  },
};

export const de: LandingContent = {
  nav: { home: "Startseite", download: "Download", privacy: "Datenschutz" },
  hero: {
    headline: "Dein Handy ist ein Stream Deck.",
    lead:
      "kekkeys ist eine kostenlose Stream Deck App für dein Handy — verwandelt dein Android-Gerät in ein programmierbares Hotkey-Deck für die Windows-Apps, in denen du lebst. Boards am Handy konfigurieren, Buttons drücken, echte Tastendrücke landen auf deinem PC über lokales WiFi. Gebaut für OBS, Blender, Photoshop, DaVinci, Premiere — und jeden Workflow, der auf Tastenkürzeln läuft.",
    ctaWindows: "Für Windows herunterladen",
    ctaWindowsSub: "Tray-App, kein Installationsassistent",
    ctaApk: "Bald bei Google Play",
    ctaApkSub: "Android · Prüfung läuft",
  },
  features: {
    eyebrow: "Warum kekkeys",
    title: "Eine kostenlose Stream Deck App — dein Handy ist das Deck.",
    items: [
      {
        title: "Komplett am Handy konfiguriert",
        body:
          "Wähle die Rastergröße, ziehe Buttons in die Zellen, wähle aus 3866 Material-Symbols-Icons, weise Kombinationen mit einem visuellen Builder zu. Der Desktop hört nur zu und drückt.",
      },
      {
        title: "Echte Tastendrücke, keine Texteingabe",
        body:
          "Halte einen Button — die echten Tasten bleiben am PC gedrückt. Kombinationen, Modifikatoren, Hand-Tools, Multi-Touch. Funktioniert unabhängig vom Tastaturlayout.",
      },
      {
        title: "Local-first, keine Cloud",
        body:
          "Die Kopplung passiert über dein WiFi per QR. Kein Konto, keine Telemetrie, deine Secrets verlassen das LAN nie. Die Desktop-App bleibt in deiner Tray.",
      },
    ],
  },
  steps: {
    eyebrow: "So funktioniert es",
    title: "Drei Schritte. Keine Konten, keine Cloud.",
    items: [
      {
        body: "Installiere kekkeys auf deinem PC und deinem Handy.",
        sub: "Kostenlos, kein Konto. Beide Geräte im selben WiFi — das ist die komplette Einrichtung.",
      },
      {
        body: "Öffne kekkeys auf dem Desktop und scanne den QR mit deinem Handy.",
        sub: "Die Kopplung läuft über dein lokales WiFi. Nichts verlässt das LAN.",
      },
      {
        body: "Erstelle ein Board am Handy, tippe einen Button — echte Tastendrücke landen auf deinem PC.",
        sub: "Tippen oder halten. Multi-Touch sendet Akkorde. So viele Boards wie du willst, eins pro App.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Häufige Fragen",
    items: [
      {
        q: "Ist kekkeys eine kostenlose Stream-Deck-Alternative?",
        a: "Ja. Free unterstützt ein Board auf einem gekoppelten PC mit allen Kernfunktionen — Drag-and-Drop-Builder, Tastenkombinationen, Multi-Touch, Sticky-Modifikatoren. PRO ist ein einmaliger Kauf für 9,99 $ und schaltet unbegrenzte Boards, eigene Button-Farben, eigene Icons und Multi-PC-Kopplung frei. Kein Abo.",
      },
      {
        q: "Brauche ich ein Stream Deck oder andere Hardware?",
        a: "Nein. kekkeys läuft komplett auf deinem Handy und deinem Windows-PC — keine Elgato-Hardware, kein USB-Peripheriegerät, kein Zusatzgerät. Der Bildschirm deines Handys ist das Deck.",
      },
      {
        q: "Mit welchen Apps funktioniert es?",
        a: "Mit jeder Windows-App, die Tastenkürzel verwendet. Getestet mit Photoshop, Animate, Blender, DaVinci Resolve, OBS, Figma, Premiere, After Effects, Krita, Lightroom, ToonBoom und vielen mehr. Wenn die App auf einen Hotkey von deiner physischen Tastatur reagiert, kann kekkeys ihn auslösen.",
      },
      {
        q: "Gehen die Tastendrücke über die Cloud?",
        a: "Nein. kekkeys nutzt eine direkte Verbindung zwischen Handy und PC über dein lokales WiFi. Die Kopplung erfolgt per QR-Code; Secrets werden im OS-Keystore gespeichert (Android Keystore am Handy, DPAPI unter Windows). Nichts verlässt dein LAN.",
      },
      {
        q: "Kann ich Akkorde senden oder Modifikatoren halten?",
        a: "Ja. Zwei Finger am Handy senden Akkorde wie Strg+Umschalt+Z. Außerdem gibt es einen Sticky-Toggle: einmal tippen, um einen Modifikator (z. B. Shift) gedrückt zu halten, erneut tippen zum Loslassen. Funktioniert für jede Kombination.",
      },
      {
        q: "Gibt es eine Mac-, Linux- oder iOS-Version?",
        a: "Nicht in v1.0 — Desktop nur Windows 10/11, Mobile nur Android. macOS, Linux und iOS sind für zukünftige Releases auf der Roadmap.",
      },
      {
        q: "Sammelt kekkeys Daten oder Telemetrie?",
        a: "Nein. Keine Server, keine Analyse, keine Telemetrie, kein Tracking. Wir haben überhaupt kein Backend — Boards und Tastendrücke verlassen dein lokales Netzwerk nie. Die Datenschutzseite erklärt das ausführlich.",
      },
      {
        q: "Was passiert, wenn ich mein Handy verliere oder die App neu installiere?",
        a: "Boards werden am Handy gespeichert, eine Neuinstallation startet leer. Nutze „Als JSON exportieren\" in den Einstellungen für regelmäßige Backups. Der PRO-Kauf ist mit deinem Google-Konto verknüpft — tippe „Käufe wiederherstellen\" auf dem Upgrade-Bildschirm und PRO ist wieder da, ohne nochmal zu zahlen.",
      },
    ],
  },
  download: {
    title: "Herunterladen",
    intro:
      "kekkeys sind zwei Apps: eine Tray-App auf Windows, die Tasten auslöst, und eine Handy-App, in der du Boards baust. Hol dir beide.",
    windowsTitle: "Windows",
    windows: [
      "Lade den aktuellen Installer über den Link unten herunter.",
      "Starte ihn. SmartScreen warnt — klicke „Weitere Informationen\" → „Trotzdem ausführen\".",
      "kekkeys erscheint in deiner Tray. Klicke das Icon, um den QR zu öffnen.",
    ],
    windowsCallout:
      "Code-Signierung steht auf der Roadmap. Bis dahin ist die SmartScreen-Warnung zu erwarten.",
    androidTitle: "Android",
    android: [
      "Bei Google Play eingereicht. Prüfung läuft.",
      "Sobald verfügbar, kekkeys aus Google Play installieren.",
      "Öffne kekkeys, tippe „QR scannen\", richte es auf den Desktop-Bildschirm. Fertig.",
    ],
    androidCallout:
      "Wir veröffentlichen den Google-Play-Link hier, sobald die App genehmigt ist.",
  },
  privacy: {
    title: "Datenschutzerklärung",
    body: [
      "kekkeys sammelt nichts. Es gibt keine Server. Es gibt keine Telemetrie.",
      "Deine Boards werden auf deinem Handy gespeichert. Kopplungs-Secrets werden im OS-Keystore am Handy und per DPAPI auf Windows abgelegt. Beides bleibt lokal — nichts reist über dein WiFi hinaus.",
      "Kopplungsdaten zwischen Handy und PC: Handyname, gedrückte Tastenkombinationen, Zeitstempel. Nichts davon wird protokolliert oder über das LAN hinaus übertragen.",
      "Es gibt kein Konto. Es gibt keinen „Passwort vergessen\"-Ablauf, weil es keine Passwörter gibt.",
      "Wir verwenden auf dieser Seite keine Cookies oder Analyse-Tools. Dein Besuch hier wird nicht getrackt.",
      "Material-Symbols-Icons sind © Google, lizenziert unter Apache 2.0.",
      "Wenn wir etwas ändern, das diese Richtlinie betrifft, ist diese Seite die Quelle der Wahrheit und wird oben datiert.",
    ],
  },
  footer: {
    copy: "© kekkeys",
    privacy: "Datenschutz",
    download: "Download",
  },
};

export const ja: LandingContent = {
  nav: { home: "ホーム", download: "ダウンロード", privacy: "プライバシー" },
  hero: {
    headline: "あなたのスマホがStream Deck。",
    lead:
      "kekkeysはスマホで使える無料のStream Deck（ストリームデック）アプリ — Android端末をプログラマブルなホットキーデックに変えます。OBS、Blender、Photoshop、DaVinci、Premiere、After Effects、Animate、Figmaなど、よく使うWindowsアプリ向けに。スマホでボードを設定し、ボタンを押すと、本物のキー入力がローカルWiFi経由でPCで実行されます。",
    ctaWindows: "Windows版をダウンロード",
    ctaWindowsSub: "トレイアプリ、インストーラなし",
    ctaApk: "Google Play近日公開",
    ctaApkSub: "Android · 審査中",
  },
  features: {
    eyebrow: "なぜkekkeys",
    title: "無料のStream Deck（ストリームデック）アプリ — あなたのスマホがデック。",
    items: [
      {
        title: "スマホですべて設定",
        body:
          "好きなグリッドサイズを選び、ボタンをセルにドラッグ、3866個のMaterial Symbolsアイコンから選択、ビジュアルビルダーでキーコンボを設定。デスクトップは聞いて押すだけ。",
      },
      {
        title: "本物のキー入力、テキストではない",
        body:
          "ボタンを長押しすると、本物のキーがPC上で押されたままになります。コンボ、修飾キー、ハンドツール、マルチタッチ。キーボードレイアウトに関係なく動作。",
      },
      {
        title: "ローカル優先、クラウドなし",
        body:
          "ペアリングはWiFi経由のQRで行われます。アカウント不要、テレメトリーなし、シークレットがLANを離れることはありません。デスクトップアプリはトレイに常駐。",
      },
    ],
  },
  steps: {
    eyebrow: "使い方",
    title: "3ステップ。アカウント不要、クラウド不要。",
    items: [
      {
        body: "kekkeysをPCとスマホにインストール。",
        sub: "無料、アカウント不要。両方の端末を同じWiFiネットワークに接続 — それだけ。",
      },
      {
        body: "デスクトップでkekkeysを開き、スマホでQRをスキャン。",
        sub: "ペアリングはローカルWiFi経由。LANを離れるものはありません。",
      },
      {
        body: "スマホでボードを作成し、ボタンをタップ — PCで本物のキー入力が走ります。",
        sub: "タップまたは長押し。マルチタッチでコード入力。アプリごとにボードを好きなだけ。",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "よくある質問",
    items: [
      {
        q: "kekkeysは無料のStream Deck代替ですか?",
        a: "はい。Freeは1台のペアリング済みPCで1つのボードに対応し、すべての主要機能(ドラッグ&ドロップビルダー、キーコンボ、マルチタッチ、Stickyモディファイア)を含みます。PROは$9.99の買い切りで、ボード無制限、カスタムボタンカラー、自前アイコン、マルチPCペアリングをアンロックします。サブスクリプションはありません。",
      },
      {
        q: "Stream Deckなどのハードウェアは必要ですか?",
        a: "いいえ。kekkeysはスマホとWindows PCだけで動作します — Elgatoのハードウェアも、USB周辺機器も、追加デバイスも不要。スマホの画面そのものがデックです。",
      },
      {
        q: "どのアプリで使えますか?",
        a: "キーボードショートカットを使うあらゆるWindowsアプリ。Photoshop、Animate、Blender、DaVinci Resolve、OBS、Figma、Premiere、After Effects、Krita、Lightroom、ToonBoomなどで動作確認済み。物理キーボードのホットキーに反応するアプリなら、kekkeysから送信できます。",
      },
      {
        q: "キー入力はクラウド経由ですか?",
        a: "いいえ。kekkeysはスマホとPCの間でローカルWiFi経由の直接接続を使用します。ペアリングはQRコード、シークレットはOSのキーストアに保管(スマホはAndroid Keystore、WindowsはDPAPI)。何もLANを離れません。",
      },
      {
        q: "コードや修飾キーの保持はできますか?",
        a: "はい。2本指でCtrl+Shift+Zのようなコードを送信できます。Stickyトグルもあります: 1回タップで修飾キー(Shiftなど)を押下保持、もう1回タップで解放。あらゆる組み合わせで動作します。",
      },
      {
        q: "MacやLinux、iOS版はありますか?",
        a: "v1.0はデスクトップがWindows 10/11のみ、モバイルがAndroidのみ。macOS、Linux、iOSは将来のリリースに向けてロードマップにあります。",
      },
      {
        q: "kekkeysはデータやテレメトリーを収集しますか?",
        a: "いいえ。サーバーなし、解析なし、テレメトリーなし、トラッキングなし。バックエンド自体がありません — ボードやキー入力がローカルネットワークを離れることはありません。プライバシーページで詳細を確認できます。",
      },
      {
        q: "スマホを失くしたりアプリを再インストールしたら?",
        a: "ボードはスマホに保存されているので、新規インストールでは空の状態で始まります。設定の「JSONにエクスポート」で定期的にバックアップを取りましょう。PRO購入はGoogleアカウントに紐づいているので、Upgrade画面で「購入を復元」をタップすれば再支払いなしでPROが戻ります。",
      },
    ],
  },
  download: {
    title: "ダウンロード",
    intro:
      "kekkeysは2つのアプリで構成されます: キーを押すWindowsトレイアプリと、ボードを作るスマホアプリ。両方が必要です。",
    windowsTitle: "Windows",
    windows: [
      "下のリンクから最新のインストーラをダウンロード。",
      "実行してください。SmartScreenが警告を表示します — 「詳細情報」→「実行」をクリック。",
      "kekkeysがシステムトレイに表示されます。アイコンをクリックしてQRを開きます。",
    ],
    windowsCallout:
      "コード署名はロードマップ上にあります。それまではSmartScreenの警告は想定通りです。",
    androidTitle: "Android",
    android: [
      "Google Playに申請済み。審査中。",
      "公開され次第、Google Playからkekkeysをインストールしてください。",
      "kekkeysを開き、QRスキャンをタップ、PCの画面にかざします。完了。",
    ],
    androidCallout:
      "アプリの承認後、ここにGoogle Playのリンクを掲載します。",
  },
  privacy: {
    title: "プライバシーポリシー",
    body: [
      "kekkeysは何も収集しません。サーバーはありません。テレメトリーもありません。",
      "ボードはスマホに保存されます。ペアリングのシークレットはスマホのOSキーストアとWindowsのDPAPIに保管されます。どちらもローカルに留まり、WiFiを超えて移動することはありません。",
      "スマホとPC間でやり取りされるペアリングデータ: スマホ名、ユーザーが押したキーコンボ、タイムスタンプ。これらはログに記録されず、LANの外には送信されません。",
      "アカウントはありません。パスワードがないので「パスワードを忘れた」フローもありません。",
      "このサイトでCookieや解析ツールは使用していません。あなたの訪問はトラッキングされません。",
      "Material SymbolsアイコンはGoogle © です。Apache 2.0で配布されています。",
      "このポリシーに影響する変更があれば、このページが信頼できる情報源となり、ページの上部に日付が記載されます。",
    ],
  },
  footer: {
    copy: "© kekkeys",
    privacy: "プライバシー",
    download: "ダウンロード",
  },
};

export const locales = ["en", "ru", "es", "de", "ja"] as const;
export type Locale = (typeof locales)[number];

export const content: Record<Locale, LandingContent> = { en, ru, es, de, ja };

/** hreflang map for `metadata.alternates.languages`. `path` is e.g. `/` or `/download/`. */
export function altLanguages(path: string): Record<string, string> {
  return {
    "en-US": `/en${path}`,
    "ru-RU": `/ru${path}`,
    "es-ES": `/es${path}`,
    "de-DE": `/de${path}`,
    "ja-JP": `/ja${path}`,
    "x-default": `/en${path}`,
  };
}
