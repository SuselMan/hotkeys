// Renderer for the desktop tray window. Keeps logic minimal — the main
// process is the source of truth, IPC pushes drive UI updates.
const api = window.kekkeys;

const QR_REFRESH_MS = 2 * 60 * 1000; // tokens live 5 min, refresh well before

const els = {
  status: document.getElementById("status"),
  qr: document.getElementById("qr"),
  qrHost: document.getElementById("qr-host"),
  pairedList: document.getElementById("paired-list"),
};

function setStatus(connected, name) {
  if (!els.status) return;
  els.status.classList.toggle("status-connected", connected);
  els.status.classList.toggle("status-disconnected", !connected);
  els.status.textContent = connected
    ? `Connected · ${name ?? "phone"}`
    : "Waiting for connection";
}

async function refreshQr() {
  if (!api) return;
  try {
    const info = await api.refreshPairInfo();
    if (els.qr) {
      els.qr.innerHTML = "";
      const img = document.createElement("img");
      img.src = info.qrDataUrl;
      img.alt = "Pairing QR";
      img.style.width = "100%";
      img.style.height = "100%";
      els.qr.appendChild(img);
    }
    if (els.qrHost) {
      els.qrHost.textContent = info.host
        ? `${info.host}:${info.port} · ${info.pcName}`
        : `port ${info.port} · ${info.pcName} · LAN IP not detected`;
    }
  } catch (e) {
    if (els.qr) {
      els.qr.innerHTML = "";
      const span = document.createElement("span");
      span.className = "placeholder";
      span.textContent = "QR unavailable";
      els.qr.appendChild(span);
    }
    console.error("refreshPairInfo failed", e);
  }
}

async function refreshPaired() {
  if (!api || !els.pairedList) return;
  const list = await api.listPaired();
  els.pairedList.innerHTML = "";
  if (list.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No phones paired yet";
    els.pairedList.appendChild(li);
    return;
  }
  for (const p of list) {
    const li = document.createElement("li");
    li.className = "paired-row";

    const name = document.createElement("div");
    name.className = "paired-name";
    name.textContent = p.phoneName;

    const meta = document.createElement("div");
    meta.className = "paired-meta";
    const seen = p.lastSeenAt ? new Date(p.lastSeenAt).toLocaleString() : "never";
    meta.textContent = `last seen: ${seen}`;

    const forget = document.createElement("button");
    forget.textContent = "Forget";
    forget.addEventListener("click", async () => {
      await api.forgetPaired(p.phoneDeviceId);
    });

    const left = document.createElement("div");
    left.className = "paired-left";
    left.appendChild(name);
    left.appendChild(meta);

    li.appendChild(left);
    li.appendChild(forget);
    els.pairedList.appendChild(li);
  }
}

async function init() {
  if (!api) {
    console.warn("[kekkeys] preload API missing");
    return;
  }

  await Promise.all([refreshQr(), refreshPaired()]);

  const initialStatus = await api.getConnectionStatus();
  setStatus(initialStatus.connected, initialStatus.activeClientName);

  api.onConnectionChanged((s) => {
    setStatus(s.connected, s.activeClientName);
    // A fresh connection means our advertised token may have just been
    // consumed during pair — show a new one before the user can blink.
    if (s.connected) refreshQr();
  });

  api.onPairingsChanged(() => {
    refreshPaired();
    // Forget / new pair both invalidate the displayed token's usefulness:
    // if the user just hit Forget they want to repair, and they need a token
    // that wasn't burned by the previous pair.
    refreshQr();
  });

  setInterval(refreshQr, QR_REFRESH_MS);
}

init();
