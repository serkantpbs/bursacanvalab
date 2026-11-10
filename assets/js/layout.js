/* Ortak üst bilgi, alt bilgi ve yardımcılar */
(function () {
  const C = window.LAB_CONFIG;
  const NAV = [
    ["index.html", "Ana Sayfa"],
    ["sinifimiz.html", "Sınıfımız"],
    ["araclar.html", "Araçlar"],
    ["materyaller.html", "Öğretim Materyalleri"],
    ["randevu.html", "Randevu"],
    ["rapor.html", "Etkinlik Raporu"]
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
    el.innerHTML = `
      <div class="wrap header-in">
        <a class="brand" href="index.html">
          <img class="brand-logo" src="${esc(C.LOGO)}" alt="" onerror="this.remove()">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40"><defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00C4CC"/><stop offset=".55" stop-color="#6A5AE0"/><stop offset="1" stop-color="#7D2AE8"/></linearGradient></defs><rect width="40" height="40" rx="12" fill="url(#bg1)"/><path d="M12 26c3-8 6-12 9-12 2 0 3 1.5 3 3.5S22 22 18.5 22c-1 0-1.7-.3-2.2-.8M24 25c1.6 1 3.3 1 5-.4" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>
          </span>
          <span class="brand-text"><b>${esc(C.LAB_ADI)}</b><small>${esc(C.KURUM)}</small></span>
        </a>
        <button class="nav-toggle" aria-label="Menüyü aç" aria-expanded="false"><span></span><span></span><span></span></button>
        <nav class="main-nav" aria-label="Ana menü">
          ${NAV.map(([h, t]) => `<a href="${h}" class="${here === h ? "active" : ""}${h === "randevu.html" ? " nav-cta" : ""}">${t}</a>`).join("")}
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
          <b>Adres</b>
          <p>${esc(C.ADRES)}${C.ILETISIM_EPOSTA ? `<br><a href="mailto:${esc(C.ILETISIM_EPOSTA)}">${esc(C.ILETISIM_EPOSTA)}</a>` : ""}${C.ILETISIM_TELEFON ? `<br>${esc(C.ILETISIM_TELEFON)}` : ""}</p>
        </div>
        <div>
          <b>Bağlantılar</b>
          <p><a href="kvkk.html">KVKK Aydınlatma Metni</a><br><a href="yonetim.html">Yönetim paneli</a></p>
        </div>
      </div>
      <div class="wrap footer-note">Canva Tasarım Laboratuvarı · ${new Date().getFullYear()}</div>`;
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

  header(); footer();
})();
