/* Ortak üst bilgi, alt bilgi ve yardımcılar */
(function () {
  const C = window.LAB_CONFIG;
  const NAV = [
    ["index.html", "Ana Sayfa"],
    ["duyurular.html", "Duyurular"],
    ["sinifimiz.html", "Sınıfımız"],
    ["araclar.html", "Araçlar"],
    ["materyaller.html", "Öğretim Materyalleri"],
    ["rapor.html", "Etkinlik Raporu"],
    ["randevu.html", "Randevu"]
  ];
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  window.esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const GUN = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  window.trDate = (key, withDay = true) => {
    const d = LabAPI.util.fromKey(key);
    return `${d.getDate()} ${AY[d.getMonth()]} ${d.getFullYear()}${withDay ? " " + GUN[d.getDay()] : ""}`;
  };
  window.TR = { GUN, AY };
  window.sessionLabel = id => { const o = C.OTURUMLAR.find(x => x.id === id); return o ? `${o.ad} (${o.saat})` : id; };

  function header() {
    const el = document.getElementById("site-header");
    if (!el) return;
    el.className = "site-header";
    el.insertAdjacentHTML("beforebegin", `<div class="topband"><div class="wrap"><span><b>T.C. ${esc(C.KURUM)}</b></span><span>${esc(C.SUBE)}</span></div></div>`);
    el.innerHTML = `
      <div class="wrap header-in" style="position:relative">
        <a class="brand" href="index.html">
          <img class="brand-logo" src="${esc(C.LOGO)}" alt="" onerror="this.remove()">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-text"><b>${esc(C.LAB_ADI)}</b><small>${esc(C.IL)}</small></span>
        </a>
        <button class="nav-toggle" aria-label="Menüyü aç" aria-expanded="false">Menü</button>
        <nav class="main-nav" aria-label="Ana menü">
          ${NAV.map(([h, t]) => `<a href="${h}" class="${here === h ? "active" : ""}${h === "randevu.html" ? " nav-cta" : ""}"${here === h ? ' aria-current="page"' : ""}>${h === "randevu.html" ? "Randevu Al" : t}</a>`).join("")}
        </nav>
      </div>
      ${LabAPI.demo ? `<div class="demo-bar">Önizleme modu: Girilen veriler yalnızca bu tarayıcıda saklanır.</div>` : ""}`;
    const btn = el.querySelector(".nav-toggle"), nav = el.querySelector(".main-nav");
    btn.addEventListener("click", () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
  }

  function footer() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.className = "site-footer";
    el.innerHTML = `
      <div class="wrap footer-in">
        <div>
          <b>${esc(C.LAB_ADI)}</b>
          <p>${esc(C.KURUM)}<br>${esc(C.SUBE)}</p>
        </div>
        <div>
          <b>Adres ve iletişim</b>
          <p>${esc(C.ADRES)}${C.ILETISIM_EPOSTA ? `<br><a href="mailto:${esc(C.ILETISIM_EPOSTA)}">${esc(C.ILETISIM_EPOSTA)}</a>` : ""}${C.ILETISIM_TELEFON ? `<br>${esc(C.ILETISIM_TELEFON)}` : ""}</p>
        </div>
        <div>
          <b>Bağlantılar</b>
          <p><a href="randevu.html">Randevu al</a><br><a href="rapor.html">Etkinlik raporu gönder</a><br><a href="kvkk.html">KVKK Aydınlatma Metni</a><br><a href="yonetim.html">Yönetim paneli</a></p>
        </div>
      </div>
      <div class="wrap footer-note">© ${new Date().getFullYear()} ${esc(C.KURUM)}</div>`;
  }

  window.toast = (msg, type = "info") => {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.dataset.type = type; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 4200);
  };

  /* Telefon alanı için 05XX XXX XX XX biçimlendirme */
  window.phoneMask = input => input.addEventListener("input", () => {
    let d = input.value.replace(/\D/g, "").slice(0, 11);
    if (d && d[0] !== "0") d = ("0" + d).slice(0, 11);
    const p = [d.slice(0, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)].filter(Boolean);
    input.value = p.join(" ");
  });

  window.fillIlceler = sel => {
    sel.innerHTML = `<option value="">İlçe seçin</option>` + LAB_DATA.ILCELER.map(i => `<option>${esc(i)}</option>`).join("");
  };

  /* ---------- Duyurular ---------- */
  const TUR = { atolye: ["Atölye", "#2C3FBF"], duyuru: ["Duyuru", "#1F8A57"], kapali: ["Laboratuvar kapalı", "#B8342A"] };
  window.annType = t => TUR[t] || TUR.duyuru;
  window.renderAnnouncement = (a, full) => {
    const [ad, renk] = annType(a.tur);
    const metin = esc(a.metin || "").replace(/\n/g, "<br>");
    return `<article class="ann${full ? " ann-full" : ""}" id="${esc(a.id)}">
      ${a.gorsel ? `<img class="ann-img" src="${esc(a.gorsel)}" alt="" loading="lazy">` : ""}
      <div class="ann-body">
        <div class="ann-meta"><span class="tag" style="--c:${renk}">${ad}</span><time>${a.yayin ? esc(trDate(a.yayin, false)) : ""}</time></div>
        <h3>${esc(a.baslik)}</h3>
        <p class="${full ? "" : "ann-clip"}">${metin}</p>
        ${a.baglanti ? `<a class="btn btn-soft btn-sm" href="${esc(a.baglanti)}" target="_blank" rel="noopener">${a.tur === "atolye" ? "Başvur" : "Ayrıntılar"}</a>` : ""}
        ${!full ? `<a class="ann-more" href="duyurular.html#${esc(a.id)}">Duyurunun tamamı</a>` : ""}
      </div></article>`;
  };
  window.LabAnnouncements = (async () => {
    const KEY = "labDuyuru_v1";
    try { const c = JSON.parse(sessionStorage.getItem(KEY) || "null"); if (c && Date.now() - c.t < 180000) return c.r; } catch (e) {}
    const r = await LabAPI.announcements();
    if (r && r.ok) { try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), r })); } catch (e) {} }
    return r && r.ok ? r : { aktif: [], arsiv: [] };
  })();
  function noticeBar() {
    const el = document.getElementById("site-header"); if (!el) return;
    LabAnnouncements.then(r => {
      const f = (r.aktif || []).find(a => a.onecikar === "evet"); if (!f) return;
      const [, renk] = annType(f.tur);
      el.insertAdjacentHTML("beforeend", `<div class="notice-bar" style="--c:${renk}"><div class="wrap"><b>${esc(f.baslik)}</b><a href="duyurular.html#${esc(f.id)}">Ayrıntılar</a></div></div>`);
    });
  }

  header(); footer(); noticeBar();
})();
