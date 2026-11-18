const tracks = [
  {
    title: "Night Market",
    artist: "Amara K.",
    city: "Lagos",
    format: "WAV · 24-bit",
    pay: "₦4,500",
    receive: "₦4,140",
    merch: "Tee · 18 of 200 left",
    kind: "WAV master",
    rail: "momo",
    art: "art-night",
    seed: 3,
  },
  {
    title: "Harmattan Tape",
    artist: "Kojo M.",
    city: "Accra",
    format: "FLAC",
    pay: "GH₵40",
    receive: "GH₵37",
    merch: "No merch on this drop",
    kind: "FLAC master",
    rail: "momo",
    art: "art-dust",
    seed: 11,
  },
  {
    title: "Orange Line",
    artist: "Awa D.",
    city: "Dakar",
    format: "WAV · 24-bit",
    pay: "2 500 F CFA",
    receive: "2 300 F CFA",
    merch: "Poster · 40 of 150 left",
    kind: "WAV master",
    rail: "orange",
    art: "art-line",
    seed: 19,
  },
];

const studioPrices = { GHS: 150, NGN: 15000, XOF: 9000, KES: 1800, USD: 12 };
const money = {
  GHS: new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 }),
  NGN: new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }),
  XOF: new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }),
  KES: new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
};

function wave(seed, count = 56) {
  const bars = [];
  let s = seed * 997;
  for (let i = 0; i < count; i += 1) {
    s = (s * 48271) % 2147483647;
    const n = (s % 1000) / 1000;
    const shape = Math.abs(Math.sin(i * 0.42 + seed)) * 0.72 + n * 0.28;
    bars.push(Math.round(18 + shape * 82));
  }
  return bars;
}

function paintBars(el, heights) {
  el.innerHTML = heights
    .map((h, i) => `<i style="--h:${h}%;--d:${(i % 12) * 0.05}s"></i>`)
    .join("");
}

let active = 0;
const trackList = document.querySelector("#trackList");
const studioBars = document.querySelector("#studioBars");
const previewBars = document.querySelector("#previewBars");

function renderTracks() {
  trackList.innerHTML = tracks
    .map(
      (track, i) => `<button class="track${i === active ? " is-on" : ""}" type="button" role="option" aria-selected="${i === active}" data-track="${i}">
        <small>${track.city} · ${track.format}</small>
        <b>${track.title}</b>
      </button>`
    )
    .join("");
}

function showTrack(index) {
  active = index;
  const track = tracks[index];
  document.querySelector("#nowKicker").textContent = `${track.city} · ${track.format}`;
  document.querySelector("#nowTitle").textContent = track.title;
  document.querySelector("#nowMeta").textContent = `Sample release · ${track.artist}`;
  document.querySelector("#nowMerch").textContent = track.merch;
  document.querySelector("#fanPays").textContent = track.pay;
  document.querySelector("#youReceive").textContent = track.receive;
  paintBars(studioBars, wave(track.seed, 220));
  document.querySelectorAll("[data-rail]").forEach((btn) => {
    btn.classList.toggle("is-on", btn.dataset.rail === track.rail);
  });
  renderTracks();
}

function sideScroll(el) {
  let drag = null;
  el.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    drag = { x: event.clientX, left: el.scrollLeft, moved: false, id: event.pointerId };
  });
  el.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 4) drag.moved = true;
    if (!drag.moved) return;
    el.classList.add("is-dragging");
    el.scrollLeft = drag.left - dx;
  });
  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    if (drag.moved) el.dataset.dragged = "1";
    drag = null;
    el.classList.remove("is-dragging");
  }
  el.addEventListener("pointerup", endDrag);
  el.addEventListener("pointercancel", endDrag);
  el.addEventListener("click", (event) => {
    if (!el.dataset.dragged) return;
    delete el.dataset.dragged;
    event.preventDefault();
    event.stopPropagation();
  }, true);
  el.addEventListener("wheel", (event) => {
    if (el.scrollWidth <= el.clientWidth + 1) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta) return;
    el.scrollLeft += delta;
    event.preventDefault();
  }, { passive: false });
}
sideScroll(trackList);
trackList.addEventListener("click", (event) => {
  if (trackList.dataset.dragged) {
    delete trackList.dataset.dragged;
    return;
  }
  const btn = event.target.closest("[data-track]");
  if (!btn) return;
  showTrack(Number(btn.dataset.track));
});

document.querySelectorAll("[data-rail]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-rail]").forEach((other) => other.classList.toggle("is-on", other === btn));
    const name = btn.dataset.rail === "momo" ? "MTN MoMo" : "Orange Money";
    document.querySelector("#railNote").textContent = `Sample payout selected: ${name}. Open plan keeps 8%. Nothing is paid out.`;
  });
});

const catalog = document.querySelector("#catalog");
catalog.innerHTML = tracks
  .map(
    (track, i) => `<article class="drop">
      <div class="art ${track.art}"></div>
      <div class="drop-body">
        <p class="drop-kicker">${track.city} · ${track.format}</p>
        <h3>${track.title}</h3>
        <p>${track.artist} · ${track.merch}</p>
        <div class="drop-actions">
          <button class="btn" type="button" data-preview="${i}" aria-label="Preview 0:30 of ${track.title}">Preview</button>
          <button class="btn btn-dark" type="button" data-buy data-title="${track.title}" data-price="${track.pay}" data-kind="${track.kind}" aria-label="Buy ${track.title} for ${track.pay}">${track.pay}</button>
        </div>
      </div>
    </article>`
  )
  .join("");
sideScroll(catalog);

const previewDialog = document.querySelector("#previewDialog");
const previewSheet = document.querySelector("#previewSheet");
const scrub = document.querySelector("#scrub");
const playBtn = document.querySelector("#playBtn");
const player = { t: 0, playing: false, raf: 0, last: 0, index: 0 };

function formatTime(value) {
  const s = Math.min(30, Math.max(0, value));
  const whole = Math.floor(s);
  return `0:${String(whole).padStart(2, "0")}`;
}

function paintPlayhead() {
  const pct = (player.t / 30) * 100;
  scrub.value = String(player.t);
  scrub.style.setProperty("--p", `${pct}%`);
  document.querySelector("#timeNow").textContent = formatTime(player.t);
  const status = document.querySelector("#previewStatus");
  if (player.t >= 30) status.textContent = "Preview ended at 0:30. The rest of the master is the paid file.";
  else if (player.playing) status.textContent = "Playing the 30-second window. Visual only — no audio in this sample.";
  else status.textContent = "Visual player only. No audio in this sample.";
  playBtn.textContent = player.playing ? "Pause" : player.t >= 30 ? "Replay preview" : "Play preview";
  previewSheet.classList.toggle("is-playing", player.playing);
}

function tick(now) {
  if (!player.playing) return;
  const dt = (now - player.last) / 1000;
  player.last = now;
  player.t = Math.min(30, player.t + dt);
  if (player.t >= 30) player.playing = false;
  paintPlayhead();
  if (player.playing) player.raf = requestAnimationFrame(tick);
}

function setPlaying(next) {
  player.playing = next;
  if (player.playing) {
    if (player.t >= 30) player.t = 0;
    player.last = performance.now();
    player.raf = requestAnimationFrame(tick);
  } else {
    cancelAnimationFrame(player.raf);
  }
  paintPlayhead();
}

function openPreview(index) {
  const track = tracks[index];
  if (player.index !== index) {
    player.index = index;
    player.t = 0;
    setPlaying(false);
    paintBars(previewBars, wave(track.seed, 48));
  }
  document.querySelector("#previewTitle").textContent = track.title;
  document.querySelector("#previewMeta").textContent = `Sample release · ${track.artist} · ${track.city}`;
  document.querySelector("#buyFromPreview").dataset.title = track.title;
  document.querySelector("#buyFromPreview").dataset.price = track.pay;
  document.querySelector("#buyFromPreview").dataset.kind = track.kind;
  paintPlayhead();
  previewDialog.showModal();
}

document.querySelector("#studioPreview").addEventListener("click", () => openPreview(active));
document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-preview]");
  if (!btn || btn.id === "studioPreview") return;
  openPreview(Number(btn.dataset.preview));
});

playBtn.addEventListener("click", () => setPlaying(!player.playing));
scrub.addEventListener("input", () => {
  player.t = Number(scrub.value);
  paintPlayhead();
});
previewDialog.addEventListener("close", () => setPlaying(false));

const payDialog = document.querySelector("#payDialog");
const payForm = document.querySelector("#payForm");
const payFormView = document.querySelector("#payFormView");
const paySuccess = document.querySelector("#paySuccess");

function openPay(title, price, kind) {
  payFormView.hidden = false;
  paySuccess.hidden = true;
  payForm.reset();
  document.querySelector("#payError").textContent = "";
  document.querySelector("#payTitle").textContent = title;
  document.querySelector("#payKind").textContent = `${kind} · ${price}`;
  payForm.dataset.price = price;
  payForm.dataset.title = title;
  payDialog.showModal();
}

document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-buy]");
  if (!btn) return;
  openPay(btn.dataset.title, btn.dataset.price, btn.dataset.kind);
});

document.querySelector("#buyFromPreview").addEventListener("click", (event) => {
  const btn = event.currentTarget;
  previewDialog.close();
  openPay(btn.dataset.title, btn.dataset.price, btn.dataset.kind);
});

payForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(payForm);
  const digits = String(data.get("phone") || "").replace(/\D/g, "");
  const error = document.querySelector("#payError");
  if (digits.length < 8) {
    error.textContent = "Enter the mobile money number to simulate a settlement.";
    payForm.phone.setAttribute("aria-invalid", "true");
    payForm.phone.focus();
    return;
  }
  payForm.phone.removeAttribute("aria-invalid");
  error.textContent = "";
  document.querySelector("#paySuccessCopy").textContent = `${payForm.dataset.title} · ${payForm.dataset.price} queued to ${data.get("rail")} ending ${digits.slice(-4)}. No money moved. This checkout is a sample.`;
  payFormView.hidden = true;
  paySuccess.hidden = false;
  paySuccess.querySelector("button").focus();
});

const studioDialog = document.querySelector("#studioDialog");
const studioForm = document.querySelector("#studioForm");
const studioFormView = document.querySelector("#studioFormView");
const studioSuccess = document.querySelector("#studioSuccess");

function openStudio(plan) {
  studioFormView.hidden = false;
  studioSuccess.hidden = true;
  studioForm.reset();
  document.querySelector("#studioError").textContent = "";
  document.querySelector("#planLine").textContent = `Plan · ${plan}`;
  studioForm.dataset.plan = plan;
  studioDialog.showModal();
}

document.querySelectorAll("[data-open-studio]").forEach((btn) => {
  btn.addEventListener("click", () => {
    closeMenu();
    openStudio(btn.dataset.plan || "Open");
  });
});

studioForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(studioForm);
  const digits = String(data.get("phone") || "").replace(/\D/g, "");
  const error = document.querySelector("#studioError");
  const name = String(data.get("name") || "").trim();
  const city = String(data.get("city") || "").trim();
  if (!name || !city) {
    error.textContent = "Add a name and a city.";
    return;
  }
  if (digits.length < 8) {
    error.textContent = "Enter a payout number with at least 8 digits.";
    studioForm.phone.setAttribute("aria-invalid", "true");
    studioForm.phone.focus();
    return;
  }
  studioForm.phone.removeAttribute("aria-invalid");
  error.textContent = "";
  document.querySelector("#studioReady").textContent = `${name} in ${city}.`;
  document.querySelector("#studioSuccessCopy").textContent = `Sample ${studioForm.dataset.plan} studio. Payout label: ${data.get("rail")} ending ${digits.slice(-4)}. Nothing was saved or charged.`;
  studioFormView.hidden = true;
  studioSuccess.hidden = false;
  studioSuccess.querySelector("button").focus();
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => btn.closest("dialog").close());
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", syncScroll);
});

const drawer = document.querySelector("#drawer");
const menuButtons = document.querySelectorAll("[data-open-menu]");

function openMenu() {
  drawer.hidden = false;
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  menuButtons.forEach((btn) => btn.setAttribute("aria-expanded", "true"));
  syncScroll();
  drawer.querySelector("[data-close-menu]").focus();
}

function closeMenu() {
  drawer.classList.remove("is-open");
  menuButtons.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
  syncScroll();
  setTimeout(() => {
    if (!drawer.classList.contains("is-open")) drawer.hidden = true;
  }, 400);
}

function syncScroll() {
  const dialogOpen = document.querySelector("dialog[open]");
  document.body.classList.toggle("no-scroll", drawer.classList.contains("is-open") || Boolean(dialogOpen));
}

let menuOpener = null;
menuButtons.forEach((btn) => btn.addEventListener("click", (event) => {
  menuOpener = event.currentTarget;
  openMenu();
}));
drawer.querySelector("[data-close-menu]").addEventListener("click", () => {
  closeMenu();
  if (menuOpener) menuOpener.focus();
});
drawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer.classList.contains("is-open")) {
    closeMenu();
    if (menuOpener) menuOpener.focus();
  }
});

const currencyButtons = document.querySelectorAll("[data-currency]");
function setCurrency(code) {
  currencyButtons.forEach((btn) => {
    const on = btn.dataset.currency === code;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", String(on));
  });
  document.querySelector("#priceStudio").textContent = money[code].format(studioPrices[code]);
  try { sessionStorage.setItem("sauti-currency", code); } catch (err) { /* sample preference only */ }
}
currencyButtons.forEach((btn) => btn.addEventListener("click", () => setCurrency(btn.dataset.currency)));

let saved = "GHS";
try { saved = sessionStorage.getItem("sauti-currency") || "GHS"; } catch (err) { saved = "GHS"; }
if (!studioPrices[saved]) saved = "GHS";
setCurrency(saved);

const topbar = document.querySelector("#topbar");
const hero = document.querySelector(".hero");
const heroWatch = new IntersectionObserver(([entry]) => {
  topbar.classList.toggle("is-on", !entry.isIntersecting);
}, { threshold: 0.18 });
heroWatch.observe(hero);

const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -48% 0px" });
document.querySelectorAll("#top, #features, #how, #drops, #pricing").forEach((section) => spy.observe(section));

showTrack(0);
paintBars(previewBars, wave(tracks[0].seed, 48));
paintPlayhead();
