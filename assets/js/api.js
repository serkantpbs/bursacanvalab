/* ==========================================================
   Veri katmanı
   - APPS_SCRIPT_URL doluysa Google Apps Script'e bağlanır.
   - Boşsa demo modunda tarayıcı belleğinde çalışır.
   Kendi sunucunuza entegre ederken yalnızca bu dosyadaki
   "remote" bölümünü kendi API adreslerinize uyarlamanız yeterlidir.
   ========================================================== */
(function () {
  const C = window.LAB_CONFIG, D = window.LAB_DATA;
  const AKTIF = ["beklemede", "onaylandi"];

  /* ---------- Tarih yardımcıları ---------- */
  const pad = n => String(n).padStart(2, "0");
  const toKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromKey = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const today = () => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); };
  const mondayOf = d => { const x = new Date(d); const w = (x.getDay() + 6) % 7; return addDays(x, -w); };
  const holidayOf = k => D.SABIT_TATILLER[k.slice(5)] || null;
  const phoneDigits = p => String(p || "").replace(/\D/g, "").replace(/^90/, "").replace(/^(?!0)/, "0");

  /* ---------- Ortak kurallar (Apps Script tarafında da aynısı var) ---------- */
  function validateBooking(b, bookings, closures) {
    const req = ["tarih", "oturum", "adSoyad", "okul", "ilce", "kisi", "telefon", "eposta"];
    for (const f of req) if (!String(b[f] ?? "").trim()) return "Lütfen tüm zorunlu alanları doldurun.";
    if (!b.kvkk) return "Devam etmek için KVKK aydınlatma metnini onaylamanız gerekir.";
    if (!D.ILCELER.includes(b.ilce)) return "Lütfen listeden bir ilçe seçin.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(b.eposta)) return "E-posta adresi geçerli görünmüyor.";
    if (!/^05\d{9}$/.test(phoneDigits(b.telefon))) return "Telefon numarasını 05XX XXX XX XX biçiminde yazın.";
    const kisi = Number(b.kisi);
    if (!Number.isInteger(kisi) || kisi < 1) return "Katılımcı sayısı en az 1 olmalıdır.";
    if (kisi > C.KAPASITE) return `Sınıf kapasitesi ${C.KAPASITE} kişi ile sınırlıdır. ${kisi} kişilik grup için randevu onaylanamaz.`;
    if (!C.OTURUMLAR.some(o => o.id === b.oturum)) return "Geçersiz oturum.";
    const d = fromKey(b.tarih), wd = d.getDay();
    if (wd === 0 || wd === 6) return "Randevular yalnızca pazartesi–cuma günleri için alınabilir.";
    if (d < addDays(today(), C.EN_ERKEN_GUN)) return "Bu tarih için artık randevu alınamaz.";
    if (d > addDays(today(), C.EN_GEC_HAFTA * 7)) return "Bu tarih henüz randevuya açılmadı.";
    if (holidayOf(b.tarih)) return "Seçilen gün resmî tatildir.";
    if (closures.some(c => c.tarih === b.tarih && (c.oturum === "tum" || c.oturum === b.oturum)))
      return "Seçilen oturum kullanıma kapatılmıştır.";
    if (bookings.some(x => x.tarih === b.tarih && x.oturum === b.oturum && AKTIF.includes(x.durum)))
      return "Seçilen oturum dolu. Lütfen başka bir oturum seçin.";
    const wk = toKey(mondayOf(d)), mail = b.eposta.trim().toLowerCase(), tel = phoneDigits(b.telefon);
    if (bookings.some(x => AKTIF.includes(x.durum) && toKey(mondayOf(fromKey(x.tarih))) === wk &&
        (String(x.eposta).toLowerCase() === mail || phoneDigits(x.telefon) === tel)))
      return "Aynı hafta içinde yalnızca bir oturum için randevu alabilirsiniz. Bu hafta için kayıtlı bir talebiniz bulunuyor.";
    return null;
  }

  function validateReport(r) {
    const req = ["okul", "ilce", "adSoyad", "kademe", "tarih", "oturum", "ogrenci", "kiz", "erkek", "aciklama"];
    for (const f of req) if (!String(r[f] ?? "").trim()) return "Lütfen tüm zorunlu alanları doldurun.";
    if (!r.kvkk) return "Devam etmek için KVKK aydınlatma metnini onaylamanız gerekir.";
    if (!D.ILCELER.includes(r.ilce)) return "Lütfen listeden bir ilçe seçin.";
    for (const f of ["ogrenci", "kiz", "erkek"]) {
      const n = Number(r[f]); if (!Number.isInteger(n) || n < 0) return "Öğrenci sayıları 0 veya daha büyük bir tam sayı olmalıdır.";
    }
    if (!Array.isArray(r.araclar) || !r.araclar.length) return "Lütfen kullanılan en az bir aracı seçin.";
    return null;
  }

  /* Kapatılan günler için otomatik duyuru metni */
  function closureAnnouncement(d) {
    const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const f = k => { const x = fromKey(k); return `${x.getDate()} ${AY[x.getMonth()]}`; };
    const t = d.tarihler, ilk = t[0], son = t[t.length - 1];
    const aralik = ilk === son ? `${f(ilk)} ${fromKey(ilk).getFullYear()}` : `${f(ilk)} – ${f(son)} ${fromKey(son).getFullYear()}`;
    const kapsam = d.oturum === "tum" ? "" : ` ${((C.OTURUMLAR.find(o => o.id === d.oturum) || {}).ad || "").toLocaleLowerCase("tr")} (${(C.OTURUMLAR.find(o => o.id === d.oturum) || {}).saat || ""})`.replace(" oturumu", " oturumunda");
    return { baslik: `Laboratuvar ${aralik} tarihinde kapalıdır`.replace("tarihinde", ilk === son ? "tarihinde" : "tarihleri arasında"),
      metin: `Laboratuvar ${aralik}${ilk === son ? " tarihinde" : " tarihleri arasında"}${kapsam} kullanıma kapalıdır.${d.neden ? " Neden: " + d.neden + "." : ""}`,
      tur: "kapali", baglanti: "", gorsel: "", yayin: toKey(today()), bitis: son, onecikar: "evet" };
  }

  /* Duyuruları güncel / arşiv olarak ayırır */
  function splitAnnouncements(list) {
    const t = toKey(today());
    const aktif = list.filter(a => (!a.yayin || a.yayin <= t) && (!a.bitis || a.bitis >= t))
      .sort((a, b) => (String(b.onecikar) === "evet") - (String(a.onecikar) === "evet") || String(b.yayin).localeCompare(String(a.yayin)));
    const arsiv = list.filter(a => a.bitis && a.bitis < t).sort((a, b) => String(b.bitis).localeCompare(String(a.bitis))).slice(0, 30);
    return { aktif, arsiv };
  }
  function validateAnnouncement(a) {
    if (!String(a.baslik || "").trim() || !String(a.metin || "").trim()) return "Başlık ve metin zorunludur.";
    if (!["atolye", "duyuru", "kapali"].includes(a.tur)) return "Geçersiz duyuru türü.";
    if (a.bitis && a.yayin && a.bitis < a.yayin) return "Bitiş tarihi yayın tarihinden önce olamaz.";
    if (a.baglanti && !/^https?:\/\//.test(a.baglanti)) return "Bağlantı http:// ya da https:// ile başlamalıdır.";
    return null;
  }

  const newCode = () => "CTL-" + Array.from({ length: 6 }, () =>
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

  /* ---------- Demo deposu (tarayıcı) ---------- */
  const KEY = "canvaLabDemo_v1";
  let mem = null;
  function load() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { mem = null; }
    if (!mem) mem = { randevular: [], raporlar: [], kapanislar: [], duyurular: [] };
    if (!mem.duyurular) mem.duyurular = [];
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* bellekte kalır */ } }
  const wait = v => new Promise(r => setTimeout(() => r(v), 250));

  const demo = {
    availability() {
      const s = load();
      return wait({
        ok: true,
        dolu: s.randevular.filter(b => AKTIF.includes(b.durum)).map(b => ({ tarih: b.tarih, oturum: b.oturum })),
        kapali: s.kapanislar.map(c => ({ tarih: c.tarih, oturum: c.oturum }))
      });
    },
    createBooking(b) {
      const s = load(), err = validateBooking(b, s.randevular, s.kapanislar);
      if (err) return wait({ ok: false, error: err });
      const rec = { kod: newCode(), olusturma: new Date().toISOString(), durum: "beklemede", not: "",
        tarih: b.tarih, oturum: b.oturum, adSoyad: b.adSoyad.trim(), okul: b.okul.trim(), il: C.IL,
        ilce: b.ilce, kisi: Number(b.kisi), telefon: phoneDigits(b.telefon), eposta: b.eposta.trim(),
        aciklama: (b.aciklama || "").trim() };
      s.randevular.push(rec); save();
      return wait({ ok: true, kod: rec.kod });
    },
    announcements() { return wait(Object.assign({ ok: true }, splitAnnouncements(load().duyurular))); },
    lookup(kod) {
      const b = load().randevular.find(x => x.kod === String(kod).trim().toUpperCase());
      if (!b) return wait({ ok: false, error: "Bu kodla bir randevu bulunamadı." });
      if (b.durum !== "onaylandi") return wait({ ok: false, error: "Bu randevu onaylanmış görünmüyor." });
      return wait({ ok: true, randevu: { adSoyad: b.adSoyad, okul: b.okul, ilce: b.ilce, tarih: b.tarih, oturum: b.oturum, kisi: b.kisi } });
    },
    submitReport(r) {
      const err = validateReport(r);
      if (err) return wait({ ok: false, error: err });
      const s = load();
      s.raporlar.push({ id: "R" + Date.now(), olusturma: new Date().toISOString(), kod: (r.kod || "").trim().toUpperCase(),
        okul: r.okul.trim(), il: C.IL, ilce: r.ilce, adSoyad: r.adSoyad.trim(), kademe: r.kademe, tarih: r.tarih,
        oturum: r.oturum, ogrenci: +r.ogrenci, kiz: +r.kiz, erkek: +r.erkek, aciklama: r.aciklama.trim(), araclar: r.araclar });
      save();
      return wait({ ok: true });
    },
    admin(action, sifre, data) {
      if (sifre !== C.DEMO_ADMIN_PASSWORD) return wait({ ok: false, error: "Şifre hatalı." });
      const s = load();
      if (action === "list") return wait({ ok: true, randevular: s.randevular, raporlar: s.raporlar, kapanislar: s.kapanislar, duyurular: s.duyurular, eposta: false });
      if (action === "setStatus") {
        const b = s.randevular.find(x => x.kod === data.kod);
        if (!b) return wait({ ok: false, error: "Randevu bulunamadı." });
        if (data.durum === "onaylandi" && s.randevular.some(x => x !== b && x.tarih === b.tarih && x.oturum === b.oturum && x.durum === "onaylandi"))
          return wait({ ok: false, error: "Bu oturum için onaylanmış başka bir randevu var." });
        b.durum = data.durum; b.not = data.not || ""; save();
        return wait({ ok: true, eposta: false });
      }
      if (action === "close") {
        (data.tarihler || []).forEach((t, i) => s.kapanislar.push({ id: "K" + Date.now() + "_" + i, tarih: t, oturum: data.oturum, neden: data.neden || "" }));
        if (data.duyuru) s.duyurular.push(Object.assign({ id: "D" + Date.now(), olusturma: new Date().toISOString() }, closureAnnouncement(data)));
        save();
        return wait({ ok: true });
      }
      if (action === "annSave") {
        const err = validateAnnouncement(data); if (err) return wait({ ok: false, error: err });
        const rec = { baslik: data.baslik.trim(), metin: data.metin.trim(), tur: data.tur, baglanti: (data.baglanti || "").trim(),
          gorsel: (data.gorsel || "").trim(), yayin: data.yayin || toKey(today()), bitis: data.bitis || "", onecikar: data.onecikar ? "evet" : "hayır" };
        const ex = data.id && s.duyurular.find(x => x.id === data.id);
        if (ex) Object.assign(ex, rec); else s.duyurular.push(Object.assign({ id: "D" + Date.now(), olusturma: new Date().toISOString() }, rec));
        save(); return wait({ ok: true });
      }
      if (action === "annDelete") { s.duyurular = s.duyurular.filter(x => x.id !== data.id); save(); return wait({ ok: true }); }
      if (action === "reopen") { s.kapanislar = s.kapanislar.filter(c => c.id !== data.id); save(); return wait({ ok: true }); }
      return wait({ ok: false, error: "Bilinmeyen işlem." });
    }
  };

  /* ---------- Uzak sunucu (Apps Script) ---------- */
  async function call(method, params) {
    try {
      let res;
      if (method === "GET") {
        const q = new URLSearchParams(params).toString();
        res = await fetch(`${C.APPS_SCRIPT_URL}?${q}`);
      } else {
        res = await fetch(C.APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify(params) }); // text/plain: ön kontrol isteği oluşmaz
      }
      return await res.json();
    } catch (e) {
      return { ok: false, error: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin." };
    }
  }
  const remote = {
    availability: () => call("GET", { action: "availability" }),
    createBooking: b => call("POST", { action: "createBooking", data: b }),
    lookup: kod => call("GET", { action: "lookup", kod }),
    announcements: () => call("GET", { action: "announcements" }),
    submitReport: r => call("POST", { action: "submitReport", data: r }),
    admin: (action, sifre, data) => call("POST", { action: "admin_" + action, sifre, data: data || {} })
  };

  window.LabAPI = Object.assign({}, C.APPS_SCRIPT_URL ? remote : demo, {
    demo: !C.APPS_SCRIPT_URL,
    util: { toKey, fromKey, addDays, today, mondayOf, holidayOf, phoneDigits, validateBooking, validateReport, validateAnnouncement }
  });
})();
