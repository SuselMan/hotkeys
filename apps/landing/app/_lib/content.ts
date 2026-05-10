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
      "kekkeys is a free Stream Deck alternative on your phone — a programmable macropad for the Windows apps you live in. Configure boards on the phone, press buttons, real keystrokes fire on your PC over local WiFi. Built for Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Animate, Figma — and any keyboard-shortcut workflow.",
    ctaWindows: "Download for Windows",
    ctaWindowsSub: "Tray app, no install wizard",
    ctaApk: "Download APK",
    ctaApkSub: "Android · Google Play soon",
  },
  features: {
    eyebrow: "Why kekkeys",
    title: "A free Stream Deck alternative — programmable from your phone.",
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
      "kekkeys — бесплатный аналог Stream Deck на твоём телефоне, программируемый макропад для Windows-приложений, в которых ты живёшь. Настраиваешь доски с телефона, жмёшь кнопки — на ПК фигачат настоящие клавиши через твой WiFi. Сделан для Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Animate, Figma — и любого хоткей-сценария.",
    ctaWindows: "Скачать для Windows",
    ctaWindowsSub: "Tray-приложение, без визарда",
    ctaApk: "Скачать APK",
    ctaApkSub: "Android · Google Play скоро",
  },
  features: {
    eyebrow: "Зачем kekkeys",
    title: "Бесплатный аналог Stream Deck — программируется с телефона.",
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

export const es: LandingContent = {
  nav: { home: "Inicio", download: "Descargar", privacy: "Privacidad" },
  hero: {
    headline: "Tu teléfono es tu deck de hotkeys.",
    lead:
      "kekkeys es una alternativa gratis a Stream Deck en tu teléfono — un macropad programable para las apps de Windows en las que vives. Configura tableros desde el móvil, pulsa botones, las teclas reales se disparan en tu PC por WiFi local. Hecho para Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Animate, Figma — y cualquier flujo basado en atajos de teclado.",
    ctaWindows: "Descargar para Windows",
    ctaWindowsSub: "App en bandeja, sin asistente de instalación",
    ctaApk: "Descargar APK",
    ctaApkSub: "Android · Google Play pronto",
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
      "Descarga el APK desde el enlace de abajo.",
      "Si tu móvil bloquea fuentes desconocidas, permítelo para el explorador de archivos que uses.",
      "Abre kekkeys, pulsa Escanear QR, apunta a la pantalla del PC. Listo.",
    ],
    androidCallout:
      "Lanzamiento en Google Play pendiente de validación. El APK actual está firmado con una clave estable, las actualizaciones futuras se instalan encima.",
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
    headline: "Dein Handy ist dein Hotkey-Deck.",
    lead:
      "kekkeys ist eine kostenlose Stream-Deck-Alternative auf deinem Handy — ein programmierbares Macropad für die Windows-Apps, in denen du lebst. Boards am Handy konfigurieren, Buttons drücken, echte Tastendrücke landen auf deinem PC über lokales WiFi. Gebaut für Photoshop, Blender, DaVinci Resolve, OBS, Premiere, After Effects, Animate, Figma — und jeden Workflow, der auf Tastenkürzeln läuft.",
    ctaWindows: "Für Windows herunterladen",
    ctaWindowsSub: "Tray-App, kein Installationsassistent",
    ctaApk: "APK herunterladen",
    ctaApkSub: "Android · Google Play bald",
  },
  features: {
    eyebrow: "Warum kekkeys",
    title: "Eine kostenlose Stream-Deck-Alternative — programmierbar vom Handy.",
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
      "Lade das APK über den Link unten herunter.",
      "Wenn dein Handy unbekannte Quellen blockiert, erlaube den Datei-Manager, mit dem du es geladen hast.",
      "Öffne kekkeys, tippe „QR scannen\", richte es auf den Desktop-Bildschirm. Fertig.",
    ],
    androidCallout:
      "Google-Play-Release ausstehend für die Validierung. Das aktuelle APK ist mit einem stabilen Schlüssel signiert, künftige Updates lassen sich darüber installieren.",
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
    headline: "あなたのスマホがホットキーデック。",
    lead:
      "kekkeysはスマホで使える無料のStream Deck代替 — Photoshop、Blender、DaVinci Resolve、OBS、Premiere、After Effects、Animate、Figmaなど、よく使うWindowsアプリのためのプログラマブル・マクロパッドです。スマホでボードを設定し、ボタンを押すと、本物のキー入力がローカルWiFi経由でPCで実行されます。キーボードショートカットに依存するあらゆるワークフローに対応。",
    ctaWindows: "Windows版をダウンロード",
    ctaWindowsSub: "トレイアプリ、インストーラなし",
    ctaApk: "APKをダウンロード",
    ctaApkSub: "Android · Google Play近日",
  },
  features: {
    eyebrow: "なぜkekkeys",
    title: "無料のStream Deck代替 — スマホでプログラム可能。",
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
      "下のリンクからAPKをダウンロード。",
      "スマホが提供元不明をブロックする場合は、使用したファイルマネージャーに対して許可してください。",
      "kekkeysを開き、QRスキャンをタップ、PCの画面にかざします。完了。",
    ],
    androidCallout:
      "Google Playリリースは検証待ち。現在のAPKは安定鍵で署名されているため、今後のアップデートはその上にインストールできます。",
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
