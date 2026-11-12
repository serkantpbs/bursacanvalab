/* Yönetim paneli */
(function () {
  const C = LAB_CONFIG, D = LAB_DATA, U = LabAPI.util, $ = id => document.getElementById(id);
  const DURUM = { beklemede: "Beklemede", onaylandi: "Onaylandı", reddedildi: "Reddedildi", iptal: "İptal" };
  const KAPSAM = [["tum", "Tüm gün"], ...C.OTURUMLAR.map(o => [o.id, `${o.ad} (${o.saat})`])];
  const aracAd = Object.fromEntries(D.ARACLAR.map(a => [a.id, a.ad]));
  let pw = "", S = { randevular: [], raporlar: [], kapanislar: [] };

  const store = { get: () => { try { return sessionStorage.getItem("labAdm") || ""; } catch (e) { return ""; } },
                  set: v => { try { v ? sessionStorage.setItem("labAdm", v) : sessionStorage.removeItem("labAdm"); } catch (e) {} } };
  if (LabAPI.demo) $("loginHint").innerHTML += ` <br><b>Önizleme şifresi:</b> ${esc(C.DEMO_ADMIN_PASSWORD)}`;

  async function load() {
    const r = await LabAPI.admin("list", pw);
    if (!r.ok) return r;
    S = r; renderAll(); return r;
  }
  $("loginForm").addEventListener("submit", async e => {
    e.preventDefault(); pw = $("pw").value;
    const r = await load();
    if (!r.ok) { $("loginErr").textContent = r.error; $("loginErr").classList.remove("hidden"); return; }
    store.set(pw); showPanel();
  });
  function showPanel() { $("login").classList.add("hidden"); $("panel").classList.remove("hidden"); $("mailNote").classList.toggle("hidden", !LabAPI.demo); }
  $("logout").addEventListener("click", () => { store.set(""); location.reload(); });
  $("reload").addEventListener("click", async () => { await load(); toast("Liste güncellendi."); });
  (async () => { const s = store.get(); if (s) { pw = s; const r = await load(); if (r.ok) showPanel(); else store.set(""); } })();

  /* Sekmeler */
  document.querySelector(".tabs").addEventListener("click", e => {
    const b = e.target.closest("button[data-tab]"); if (!b) return;
    document.querySelectorAll(".tabs button").forEach(x => x.classList.toggle("active", x === b));
    document.querySelectorAll("[data-pane]").forEach(p => p.classList.toggle("hidden", p.dataset.pane !== b.dataset.tab));
  });

  const sortB = arr => [...arr].sort((a, b) => (a.tarih + a.oturum).localeCompare(b.tarih + b.oturum));
  const contact = b => `${esc(b.eposta)}<br><span class="muted">${esc(b.telefon)}</span>`;
  const when = b => `<b>${esc(trDate(b.tarih))}</b><br><span class="muted">${esc((C.OTURUMLAR.find(o => o.id === b.oturum) || {}).ad || b.oturum)}</span>`;

  function renderAll() { renderPending(); renderAllBookings(); renderClosures(); renderReports(); renderAnn(); }

  function renderPending() {
    const list = sortB(S.randevular.filter(b => b.durum === "beklemede"));
    $("pendingCount").textContent = list.length;
    $("tPending").innerHTML = `<thead><tr><th>Tarih / oturum</th><th>Öğretmen</th><th>Okul / ilçe</th><th>Kişi</th><th>İletişim</th><th>Not</th><th>İşlem</th></tr></thead><tbody>${
      list.map(b => {
        const conflict = S.randevular.some(x => x !== b && x.tarih === b.tarih && x.oturum === b.oturum && x.durum === "onaylandi");
        return `<tr><td>${when(b)}</td><td>${esc(b.adSoyad)}<br><span class="muted">${esc(b.kod)}</span></td><td>${esc(b.okul)}<br><span class="muted">${esc(b.ilce)}</span></td>
        <td>${esc(b.kisi)}</td><td>${contact(b)}</td><td style="max-width:220px">${esc(b.aciklama || "—")}</td>
        <td><div class="actions">${conflict ? `<span class="status reddedildi">Oturum dolu</span>` : `<button class="btn btn-ok btn-sm" data-act="onaylandi" data-kod="${esc(b.kod)}">Onayla</button>`}
        <button class="btn btn-no btn-sm" data-act="reddedildi" data-kod="${esc(b.kod)}">Reddet</button></div></td></tr>`;
      }).join("") || `<tr><td colspan="7" class="muted">Bekleyen talep yok.</td></tr>`}</tbody>`;
  }

  function filteredBookings() {
    const d = $("fDurum").value, z = $("fZaman").value, q = $("fAra").value.trim().toLocaleLowerCase("tr"), t = U.toKey(U.today());
    return sortB(S.randevular).filter(b => (!d || b.durum === d) && (!z || (z === "gelecek" ? b.tarih >= t : b.tarih < t)) &&
      (!q || [b.adSoyad, b.okul, b.ilce, b.kod, b.eposta].join(" ").toLocaleLowerCase("tr").includes(q)));
  }
  function renderAllBookings() {
    const list = filteredBookings();
    $("tAll").innerHTML = `<thead><tr><th>Tarih / oturum</th><th>Durum</th><th>Öğretmen</th><th>Okul / ilçe</th><th>Kişi</th><th>İletişim</th><th>İşlem</th></tr></thead><tbody>${
      list.map(b => `<tr><td>${when(b)}</td><td><span class="status ${b.durum}">${DURUM[b.durum] || b.durum}</span>${b.not ? `<br><span class="muted" style="font-size:.8rem">${esc(b.not)}</span>` : ""}</td>
        <td>${esc(b.adSoyad)}<br><span class="muted">${esc(b.kod)}</span></td><td>${esc(b.okul)}<br><span class="muted">${esc(b.ilce)}</span></td><td>${esc(b.kisi)}</td><td>${contact(b)}</td>
        <td><div class="actions">${b.durum === "beklemede" ? `<button class="btn btn-ok btn-sm" data-act="onaylandi" data-kod="${esc(b.kod)}">Onayla</button><button class="btn btn-no btn-sm" data-act="reddedildi" data-kod="${esc(b.kod)}">Reddet</button>` :
          b.durum === "onaylandi" ? `<button class="btn btn-no btn-sm" data-act="iptal" data-kod="${esc(b.kod)}">İptal et</button>` : "—"}</div></td></tr>`).join("")
      || `<tr><td colspan="7" class="muted">Kayıt bulunamadı.</td></tr>`}</tbody>`;
  }
  ["fDurum", "fZaman"].forEach(id => $(id).addEventListener("change", renderAllBookings));
  $("fAra").addEventListener("input", renderAllBookings);

  /* Onay / ret / iptal penceresi */
  let pending = null;
  const MODAL = {
    onaylandi: ["Randevuyu onayla", "Öğretmene onay e-postası gönderilecek.", "Öğretmene not (isteğe bağlı)", "btn-ok", "Onayla"],
    reddedildi: ["Randevuyu reddet", "Öğretmene ret e-postası gönderilecek ve oturum yeniden boşa çıkacak.", "Ret gerekçesi (isteğe bağlı)", "btn-no", "Reddet"],
    iptal: ["Randevuyu iptal et", "Öğretmene iptal e-postası gönderilecek ve oturum yeniden boşa çıkacak.", "İptal gerekçesi (isteğe bağlı)", "btn-no", "İptal et"]
  };
  document.addEventListener("click", e => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const rec = S.randevular.find(x => x.kod === b.dataset.kod); if (!rec) return;
    pending = { kod: rec.kod, durum: b.dataset.act };
    const [t, txt, lbl, cls, ok] = MODAL[pending.durum];
    $("mTitle").textContent = t;
    $("mText").innerHTML = `<b>${esc(rec.adSoyad)}</b> · ${esc(rec.okul)}<br>${esc(trDate(rec.tarih))}, ${esc(sessionLabel(rec.oturum))}<br>${txt}`;
    $("mNotLbl").textContent = lbl; $("mNot").value = "";
    $("mOk").className = "btn " + cls; $("mOk").textContent = ok;
    $("modal").classList.add("open"); $("mNot").focus();
  });
  const closeModal = () => { $("modal").classList.remove("open"); pending = null; };
  $("mCancel").addEventListener("click", closeModal);
  $("modal").addEventListener("click", e => { if (e.target === $("modal")) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
  $("mOk").addEventListener("click", async () => {
    if (!pending) return;
    const btn = $("mOk"); btn.disabled = true;
    const r = await LabAPI.admin("setStatus", pw, { kod: pending.kod, durum: pending.durum, not: $("mNot").value.trim() });
    btn.disabled = false;
    if (!r.ok) { toast(r.error, "err"); return; }
    closeModal(); await load();
    toast(r.eposta ? "İşlem kaydedildi, öğretmene e-posta gönderildi." : "İşlem kaydedildi.", "ok");
  });

  /* Kapatma */
  $("cOt").innerHTML = KAPSAM.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join("");
  function renderClosures() {
    const t = U.toKey(U.today());
    const list = [...S.kapanislar].filter(c => c.tarih >= t).sort((a, b) => a.tarih.localeCompare(b.tarih));
    $("tClose").innerHTML = `<thead><tr><th>Tarih</th><th>Kapsam</th><th>Neden</th><th></th></tr></thead><tbody>${
      list.map(c => `<tr><td>${esc(trDate(c.tarih))}</td><td>${esc((KAPSAM.find(k => k[0] === c.oturum) || [, c.oturum])[1])}</td><td>${esc(c.neden || "—")}</td>
      <td><button class="btn btn-soft btn-sm" data-reopen="${esc(c.id)}">Yeniden aç</button></td></tr>`).join("")
      || `<tr><td colspan="4" class="muted">Kapatılmış gün ya da oturum yok.</td></tr>`}</tbody>`;
  }
  $("closeForm").addEventListener("submit", async e => {
    e.preventDefault();
    const bas = $("cBas").value, bit = $("cBit").value || bas, ot = $("cOt").value;
    if (!bas || bit < bas) { toast("Tarihleri kontrol edin.", "err"); return; }
    const tarihler = [];
    for (let d = U.fromKey(bas); d <= U.fromKey(bit); d = U.addDays(d, 1)) if (d.getDay() > 0 && d.getDay() < 6) tarihler.push(U.toKey(d));
    if (!tarihler.length) { toast("Seçilen aralıkta hafta içi gün yok.", "err"); return; }
    const r = await LabAPI.admin("close", pw, { tarihler, oturum: ot, neden: $("cNeden").value.trim(), duyuru: $("cDuyuru").checked });
    clearAnnCache();
    if (!r.ok) { toast(r.error, "err"); return; }
    const hit = S.randevular.filter(b => ["beklemede", "onaylandi"].includes(b.durum) && tarihler.includes(b.tarih) && (ot === "tum" || b.oturum === ot));
    $("closeWarn").classList.toggle("hidden", !hit.length);
    if (hit.length) $("closeWarn").innerHTML = `Kapattığınız oturumlarda ${hit.length} etkin randevu var. Bunları "Tüm randevular" sekmesinden reddetmeniz ya da iptal etmeniz gerekir:<br>` +
      hit.map(b => `• ${esc(trDate(b.tarih, false))} – ${esc(b.adSoyad)} (${esc(b.kod)})`).join("<br>");
    $("closeForm").reset(); await load(); toast(`${tarihler.length} gün kapatıldı.`, "ok");
  });
  document.addEventListener("click", async e => {
    const b = e.target.closest("button[data-reopen]"); if (!b) return;
    const r = await LabAPI.admin("reopen", pw, { id: b.dataset.reopen });
    if (!r.ok) { toast(r.error, "err"); return; }
    await load(); toast("Yeniden açıldı.", "ok");
  });

  /* Raporlar */
  const filteredReports = () => S.raporlar.filter(r => (!$("rBas").value || r.tarih >= $("rBas").value) && (!$("rBit").value || r.tarih <= $("rBit").value))
    .sort((a, b) => b.tarih.localeCompare(a.tarih));
  const bars = (el, pairs) => {
    const max = Math.max(1, ...pairs.map(p => p[1]));
    el.innerHTML = pairs.length ? pairs.map(([k, v]) => `<div class="bar"><span>${esc(k)}</span><div class="track"><div class="fill" style="width:${v / max * 100}%"></div></div><b>${v}</b></div>`).join("") : `<p class="muted">Henüz veri yok.</p>`;
  };
  const tally = (list, fn) => { const m = {}; list.forEach(r => [].concat(fn(r)).forEach(([k, v]) => m[k] = (m[k] || 0) + v)); return Object.entries(m).sort((a, b) => b[1] - a[1]); };
  function renderReports() {
    const list = filteredReports(), sum = f => list.reduce((s, r) => s + Number(r[f] || 0), 0);
    $("rStats").innerHTML = [[list.length, "etkinlik raporu"], [sum("ogrenci"), "katılan öğrenci"], [sum("kiz"), "kız öğrenci"], [sum("erkek"), "erkek öğrenci"],
      [new Set(list.map(r => r.okul.toLocaleLowerCase("tr"))).size, "farklı okul"]].map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`).join("");
    bars($("bIlce"), tally(list, r => [[r.ilce, 1]]));
    bars($("bKademe"), tally(list, r => [[r.kademe, Number(r.ogrenci)]]));
    bars($("bArac"), tally(list, r => (r.araclar || []).map(a => [aracAd[a] || a, 1])).slice(0, 10));
    $("tRep").innerHTML = `<thead><tr><th>Tarih</th><th>Öğretmen</th><th>Okul / ilçe</th><th>Kademe</th><th>Öğrenci (K/E)</th><th>Araçlar</th><th>Açıklama</th></tr></thead><tbody>${
      list.map(r => `<tr><td>${esc(trDate(r.tarih, false))}<br><span class="muted">${esc((C.OTURUMLAR.find(o => o.id === r.oturum) || {}).ad || "")}</span></td><td>${esc(r.adSoyad)}${r.kod ? `<br><span class="muted">${esc(r.kod)}</span>` : ""}</td>
      <td>${esc(r.okul)}<br><span class="muted">${esc(r.ilce)}</span></td><td>${esc(r.kademe)}</td><td>${esc(r.ogrenci)} (${esc(r.kiz)}/${esc(r.erkek)})</td>
      <td style="max-width:240px;font-size:.82rem">${(r.araclar || []).map(a => esc(aracAd[a] || a)).join(", ")}</td><td style="max-width:280px;font-size:.85rem">${esc(r.aciklama)}</td></tr>`).join("")
      || `<tr><td colspan="7" class="muted">Rapor bulunamadı.</td></tr>`}</tbody>`;
  }
  ["rBas", "rBit"].forEach(id => $(id).addEventListener("change", renderReports));

  /* CSV (Excel Türkçe için ; ayraçlı, UTF-8 BOM) */
  function csv(name, head, rows) {
    const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const txt = "﻿" + [head, ...rows].map(r => r.map(q).join(";")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/csv;charset=utf-8" }));
    a.download = `${name}_${U.toKey(U.today())}.csv`; document.body.appendChild(a); a.click(); a.remove();
  }
  $("csvB").addEventListener("click", () => csv("randevular",
    ["Kod", "Tarih", "Oturum", "Durum", "Ad Soyad", "Okul", "İl", "İlçe", "Kişi", "Telefon", "E-posta", "Planlanan etkinlik", "Yönetici notu", "Oluşturma"],
    filteredBookings().map(b => [b.kod, b.tarih, b.oturum, DURUM[b.durum] || b.durum, b.adSoyad, b.okul, b.il || C.IL, b.ilce, b.kisi, b.telefon, b.eposta, b.aciklama, b.not, b.olusturma])));
  $("csvR").addEventListener("click", () => csv("etkinlik_raporlari",
    ["Tarih", "Oturum", "Randevu kodu", "Öğretmen", "Okul", "İl", "İlçe", "Kademe", "Öğrenci", "Kız", "Erkek", "Kullanılan araçlar", "Açıklama", "Gönderim"],
    filteredReports().map(r => [r.tarih, r.oturum, r.kod, r.adSoyad, r.okul, r.il || C.IL, r.ilce, r.kademe, r.ogrenci, r.kiz, r.erkek, (r.araclar || []).map(a => aracAd[a] || a).join(", "), r.aciklama, r.olusturma])));
  /* Duyurular */
  function clearAnnCache() { try { sessionStorage.removeItem("labDuyuru_v1"); } catch (e) {} }
  window.clearAnnCache = clearAnnCache;
  function annState(a) {
    const t = U.toKey(U.today());
    if (a.bitis && a.bitis < t) return ["iptal", "Arşivde"];
    if (a.yayin && a.yayin > t) return ["beklemede", "Zamanlanmış"];
    return ["onaylandi", "Yayında"];
  }
  function renderAnn() {
    const list = [...(S.duyurular || [])].sort((a, b) => String(b.yayin).localeCompare(String(a.yayin)));
    $("tAnn").innerHTML = `<thead><tr><th>Duyuru</th><th>Tarihler</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>${
      list.map(a => { const [cls, txt] = annState(a), [tur] = annType(a.tur);
        return `<tr><td><b>${esc(a.baslik)}</b><br><span class="muted">${esc(tur)}${a.onecikar === "evet" ? ", öne çıkan" : ""}</span></td>
        <td>${a.yayin ? esc(trDate(a.yayin, false)) : "—"}<br><span class="muted">${a.bitis ? "Bitiş: " + esc(trDate(a.bitis, false)) : "Bitiş yok"}</span></td>
        <td><span class="status ${cls}">${txt}</span></td>
        <td><div class="actions"><button class="btn btn-soft btn-sm" data-annedit="${esc(a.id)}">Düzenle</button><button class="btn btn-no btn-sm" data-anndel="${esc(a.id)}">Sil</button></div></td></tr>`; }).join("")
      || `<tr><td colspan="4" class="muted">Henüz duyuru yok. Soldaki formdan ilk duyurunuzu ekleyebilirsiniz.</td></tr>`}</tbody>`;
  }
  function annReset() {
    $("annForm").reset(); $("aId").value = ""; $("annFormTitle").textContent = "Yeni duyuru";
    $("annSubmit").textContent = "Yayımla"; $("annCancel").classList.add("hidden"); $("annErr").classList.add("hidden");
  }
  $("annCancel").addEventListener("click", annReset);
  $("annForm").addEventListener("submit", async e => {
    e.preventDefault();
    const data = { id: $("aId").value, baslik: $("aBaslik").value, tur: $("aTur").value, metin: $("aMetin").value,
      yayin: $("aYayin").value, bitis: $("aBitis").value, baglanti: $("aLink").value.trim(), gorsel: $("aGorsel").value.trim(), onecikar: $("aOne").checked };
    const v = U.validateAnnouncement(data);
    if (v) { $("annErr").textContent = v; $("annErr").classList.remove("hidden"); return; }
    const btn = $("annSubmit"); btn.disabled = true;
    const r = await LabAPI.admin("annSave", pw, data);
    btn.disabled = false;
    if (!r.ok) { $("annErr").textContent = r.error; $("annErr").classList.remove("hidden"); return; }
    const edited = !!data.id; annReset(); clearAnnCache(); await load();
    toast(edited ? "Duyuru güncellendi." : "Duyuru yayımlandı.", "ok");
  });
  document.addEventListener("click", async e => {
    const ed = e.target.closest("button[data-annedit]");
    if (ed) {
      const a = (S.duyurular || []).find(x => x.id === ed.dataset.annedit); if (!a) return;
      $("aId").value = a.id; $("aBaslik").value = a.baslik; $("aTur").value = a.tur; $("aMetin").value = a.metin;
      $("aYayin").value = a.yayin || ""; $("aBitis").value = a.bitis || ""; $("aLink").value = a.baglanti || ""; $("aGorsel").value = a.gorsel || "";
      $("aOne").checked = a.onecikar === "evet"; $("annFormTitle").textContent = "Duyuruyu düzenle";
      $("annSubmit").textContent = "Değişiklikleri kaydet"; $("annCancel").classList.remove("hidden");
      $("annForm").scrollIntoView({ behavior: "smooth", block: "start" }); return;
    }
    const del = e.target.closest("button[data-anndel]");
    if (del) {
      if (del.dataset.confirm !== "1") { del.dataset.confirm = "1"; del.textContent = "Emin misiniz?"; setTimeout(() => { del.dataset.confirm = ""; del.textContent = "Sil"; }, 3000); return; }
      const r = await LabAPI.admin("annDelete", pw, { id: del.dataset.anndel });
      if (!r.ok) { toast(r.error, "err"); return; }
      clearAnnCache(); await load(); toast("Duyuru silindi.", "ok");
    }
  });
})();