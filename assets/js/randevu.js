/* Randevu takvimi ve formu */
(function () {
  const C = LAB_CONFIG, U = LabAPI.util;
  const $ = id => document.getElementById(id);
  const firstBookable = (() => { let d = U.addDays(U.today(), C.EN_ERKEN_GUN); while (d.getDay() === 0 || d.getDay() === 6) d = U.addDays(d, 1); return d; })();
  const lastBookable = U.addDays(U.today(), C.EN_GEC_HAFTA * 7);
  const minWeek = U.mondayOf(firstBookable), maxWeek = U.mondayOf(lastBookable);
  let week = new Date(minWeek), avail = { dolu: [], kapali: [] }, selected = null, loading = true;

  /* Kurallar kutusu */
  $("rulesBox").innerHTML = [
    "Randevular Pazartesi–Cuma günleri içindir.",
    `İki oturum vardır: ${C.OTURUMLAR.map(o => `${o.ad.replace(" oturumu", "")} ${o.saat}`).join(", ")}.`,
    "Öğle arası (12.30–13.30) randevuya kapalıdır.",
    "Bir öğretmen aynı hafta içinde yalnızca bir oturum seçebilir.",
    `Grup en fazla ${C.KAPASITE} kişi olabilir. Laboratuvarda ${C.BILGISAYAR_SAYISI} dizüstü bilgisayar bulunur.`,
    "Talepler yönetici onayıyla kesinleşir; sonuç e-postayla bildirilir.",
    "Takvimde dolu oturumlar yalnızca \"Dolu\" olarak görünür, kişisel bilgiler paylaşılmaz."
  ].map((t, i) => `<div><b class="n">${i + 1}</b><span>${esc(t)}</span></div>`).join("");

  /* Form hazırlığı */
  $("il").value = C.IL;
  fillIlceler($("ilce"));
  phoneMask($("telefon"));
  $("kisi").max = C.KAPASITE;
  $("kisiHint").textContent = `En fazla ${C.KAPASITE} kişi (öğretmenler dahil).`;

  function checkKisi() {
    const n = Number($("kisi").value), f = $("kisiField");
    const over = $("kisi").value !== "" && n > C.KAPASITE;
    f.classList.toggle("invalid", over);
    $("kisiErr").textContent = over ? `Sınıf kapasitesi yeterli değildir. Laboratuvar en fazla ${C.KAPASITE} kişilik gruplar için uygundur; ${n} kişilik grup için randevu onaylanamaz.` : "";
    $("submit").disabled = over;
    return !over;
  }
  $("kisi").addEventListener("input", checkKisi);

  /* Takvim */
  function slotState(key, sess) {
    const d = U.fromKey(key);
    if (d < firstBookable) return ["gecmis", "Kapalı", "Süresi geçti"];
    if (d > lastBookable) return ["kapali", "Kapalı", "Henüz açılmadı"];
    const hol = U.holidayOf(key);
    if (hol) return ["kapali", "Tatil", hol];
    if (avail.kapali.some(c => c.tarih === key && (c.oturum === "tum" || c.oturum === sess))) return ["kapali", "Kapalı", ""];
    if (avail.dolu.some(b => b.tarih === key && b.oturum === sess)) return ["dolu", "Dolu", ""];
    return ["bos", "Boş", "Seçmek için tıklayın"];
  }

  function render() {
    const days = [0, 1, 2, 3, 4].map(i => U.addDays(week, i));
    const end = days[4];
    $("weekLabel").textContent = `${week.getDate()} ${TR.AY[week.getMonth()]} – ${end.getDate()} ${TR.AY[end.getMonth()]} ${end.getFullYear()}`;
    $("prev").disabled = week <= minWeek;
    $("next").disabled = week >= maxWeek;
    let h = `<div class="hd corner" style="grid-row:1;grid-column:1"></div>`;
    C.OTURUMLAR.forEach((o, j) => { h += `<div class="sess sess-label" style="grid-row:${j + 2};grid-column:1">${esc(o.ad.replace(" oturumu", ""))}<small>${esc(o.saat)}</small></div>`; });
    days.forEach((d, i) => {
      const key = U.toKey(d);
      h += `<div class="hd" style="grid-row:1;grid-column:${i + 2}">${TR.GUN[d.getDay()]}<small>${d.getDate()} ${TR.AY[d.getMonth()]}</small></div>`;
      C.OTURUMLAR.forEach((o, j) => {
        const [cls, txt, sub] = loading ? ["kapali", "…", ""] : slotState(key, o.id);
        const isSel = selected && selected.tarih === key && selected.oturum === o.id;
        const label = `${TR.GUN[d.getDay()]} ${d.getDate()} ${TR.AY[d.getMonth()]}, ${o.ad} ${o.saat}: ${txt}`;
        h += `<button type="button" class="slot ${isSel ? "secili" : cls}" style="grid-row:${j + 2};grid-column:${i + 2}"
          data-key="${key}" data-sess="${o.id}" ${cls !== "bos" ? "disabled" : ""} aria-pressed="${!!isSel}" aria-label="${esc(label)}">
          <span class="m-only">${esc(o.ad.replace(" oturumu", ""))} · </span>${isSel ? "Seçildi" : txt}<small>${esc(isSel ? o.saat : (sub || o.saat))}</small></button>`;
      });
    });
    $("cal").innerHTML = h;
  }

  $("cal").addEventListener("click", e => {
    const b = e.target.closest(".slot"); if (!b || b.disabled) return;
    selected = { tarih: b.dataset.key, oturum: b.dataset.sess };
    $("sumDate").textContent = trDate(selected.tarih);
    $("sumSess").textContent = sessionLabel(selected.oturum);
    $("summary").classList.remove("hidden");
    $("pickFirst").classList.add("hidden");
    $("form").classList.remove("hidden");
    $("success").classList.add("hidden");
    render();
    $("formCard").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { const a = document.activeElement; if (!a || a === document.body || a.classList.contains("slot")) $("adSoyad").focus({ preventScroll: true }); }, 400);
  });
  $("prev").addEventListener("click", () => { week = U.addDays(week, -7); render(); });
  $("next").addEventListener("click", () => { week = U.addDays(week, 7); render(); });

  async function refresh() {
    loading = true; render();
    const r = await LabAPI.availability();
    loading = false;
    if (r.ok) avail = r; else toast(r.error || "Takvim yüklenemedi.", "err");
    if (selected && slotState(selected.tarih, selected.oturum)[0] !== "bos") resetSelection();
    render();
  }

  function resetSelection() {
    selected = null;
    $("summary").classList.add("hidden");
    $("form").classList.add("hidden");
    $("pickFirst").classList.remove("hidden");
  }

  $("form").addEventListener("submit", async e => {
    e.preventDefault();
    const err = $("formErr");
    err.classList.add("hidden");
    if (!selected) return;
    if (!checkKisi()) { $("kisi").focus(); return; }
    const data = {
      tarih: selected.tarih, oturum: selected.oturum,
      adSoyad: $("adSoyad").value, okul: $("okul").value, il: C.IL, ilce: $("ilce").value,
      kisi: $("kisi").value, telefon: $("telefon").value, eposta: $("eposta").value,
      aciklama: $("aciklama").value, kvkk: $("kvkk").checked
    };
    const v = U.validateBooking(data, [], []); // hızlı istemci kontrolü (dolu/haftalık kontrolü sunucuda)
    if (v) { err.textContent = v; err.classList.remove("hidden"); return; }
    const btn = $("submit"); btn.disabled = true; btn.textContent = "Gönderiliyor…";
    const r = await LabAPI.createBooking(data);
    btn.disabled = false; btn.textContent = "Randevu talebi gönder";
    if (!r.ok) { err.textContent = r.error; err.classList.remove("hidden"); refresh(); return; }
    $("code").textContent = r.kod;
    $("successText").innerHTML = `<b>${esc(trDate(data.tarih))}</b>, ${esc(sessionLabel(data.oturum))} için talebiniz yönetici onayına gönderildi. Sonuç <b>${esc(data.eposta)}</b> adresine e-postayla bildirilecek.`;
    $("form").reset(); $("il").value = C.IL;
    $("form").classList.add("hidden"); $("summary").classList.add("hidden");
    $("success").classList.remove("hidden");
    selected = null;
    refresh();
  });
  $("again").addEventListener("click", () => { $("success").classList.add("hidden"); $("pickFirst").classList.remove("hidden"); $("cal").scrollIntoView({ behavior: "smooth", block: "center" }); });

  refresh();
})();
