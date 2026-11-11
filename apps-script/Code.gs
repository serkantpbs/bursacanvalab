/* =====================================================================
   Canva Tasarım Laboratuvarı — Google Apps Script arka ucu
   Kurulum adımları için README.md dosyasına bakın.

   Komut Dosyası Özellikleri (Proje ayarları > Komut dosyası özellikleri):
     ADMIN_PASSWORD : yönetim paneli şifresi (zorunlu)
     ADMIN_EMAIL    : yeni talep bildirimlerinin gideceği adres (isteğe bağlı)
   ===================================================================== */

var AYAR = {
  LAB_ADI: 'Canva Tasarım Laboratuvarı',
  KURUM: 'Bursa İl Millî Eğitim Müdürlüğü',
  ADRES: 'BTSO Eğitim Vadisi YEĞİTEK Hizmetleri Şubesi',
  IL: 'Bursa',
  KAPASITE: 35,
  EN_ERKEN_GUN: 1,
  EN_GEC_HAFTA: 8,
  SAAT_DILIMI: 'Europe/Istanbul',
  OTURUMLAR: { sabah: 'Sabah oturumu (09.30 – 12.30)', ogle: 'Öğleden sonra oturumu (13.30 – 16.30)' },
  ILCELER: ['Büyükorhan', 'Gemlik', 'Gürsu', 'Harmancık', 'İnegöl', 'İznik', 'Karacabey', 'Keles', 'Kestel',
    'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhaneli', 'Orhangazi', 'Osmangazi', 'Yenişehir', 'Yıldırım'],
  SABIT_TATILLER: { '01-01': 1, '04-23': 1, '05-01': 1, '05-19': 1, '07-15': 1, '08-30': 1, '10-29': 1 }
};

var SAYFALAR = {
  Randevular: ['kod', 'olusturma', 'durum', 'tarih', 'oturum', 'adSoyad', 'okul', 'il', 'ilce', 'kisi', 'telefon', 'eposta', 'aciklama', 'not', 'islemTarihi'],
  Raporlar: ['id', 'olusturma', 'kod', 'tarih', 'oturum', 'adSoyad', 'okul', 'il', 'ilce', 'kademe', 'ogrenci', 'kiz', 'erkek', 'aciklama', 'araclar', 'aracAdlari'],
  Kapanislar: ['id', 'tarih', 'oturum', 'neden', 'olusturma']
};
var AKTIF = ['beklemede', 'onaylandi'];

/* ---------- İlk kurulum: bir kez çalıştırın ---------- */
function kurulum() {
  var ss = SpreadsheetApp.getActive();
  Object.keys(SAYFALAR).forEach(function (ad) {
    var sh = ss.getSheetByName(ad) || ss.insertSheet(ad);
    var h = SAYFALAR[ad];
    sh.getRange(1, 1, 1, h.length).setValues([h]).setFontWeight('bold').setBackground('#EFE6FE');
    sh.getRange(1, 1, sh.getMaxRows(), h.length).setNumberFormat('@'); // telefon başındaki 0 ve tarihler metin kalsın
    sh.setFrozenRows(1);
  });
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty('ADMIN_PASSWORD')) p.setProperty('ADMIN_PASSWORD', 'degistir-' + Math.floor(Math.random() * 1e6));
  Logger.log('Kurulum tamam. Yönetici şifresi: ' + p.getProperty('ADMIN_PASSWORD') + ' (Proje ayarlarından değiştirin)');
}

/* ---------- Giriş noktaları ---------- */
function doGet(e) {
  var a = (e.parameter || {}).action;
  try {
    if (a === 'availability') return json(musaitlik());
    if (a === 'lookup') return json(randevuBul(e.parameter.kod));
    return json({ ok: true, mesaj: AYAR.LAB_ADI + ' servisi çalışıyor.' });
  } catch (err) { return json({ ok: false, error: 'Sunucu hatası: ' + err.message }); }
}

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'Geçersiz istek.' }); }
  var a = body.action, d = body.data || {};
  try {
    if (a === 'createBooking') return json(kilitle(function () { return randevuOlustur(d); }));
    if (a === 'submitReport') return json(raporKaydet(d));
    if (a && a.indexOf('admin_') === 0) {
      if (!sifreDogru(body.sifre)) return json({ ok: false, error: 'Şifre hatalı.' });
      if (a === 'admin_list') return json(yoneticiListe());
      if (a === 'admin_setStatus') return json(kilitle(function () { return durumDegistir(d); }));
      if (a === 'admin_close') return json(kapat(d));
      if (a === 'admin_reopen') return json(yenidenAc(d));
    }
    return json({ ok: false, error: 'Bilinmeyen işlem.' });
  } catch (err) { return json({ ok: false, error: 'Sunucu hatası: ' + err.message }); }
}

/* ---------- İşlemler ---------- */
function musaitlik() {
  var dolu = oku('Randevular').filter(function (b) { return AKTIF.indexOf(b.durum) > -1; })
    .map(function (b) { return { tarih: b.tarih, oturum: b.oturum }; });          // kişisel bilgi gönderilmez
  var kapali = oku('Kapanislar').map(function (c) { return { tarih: c.tarih, oturum: c.oturum }; });
  return { ok: true, dolu: dolu, kapali: kapali };
}

function randevuOlustur(b) {
  var hata = randevuDogrula(b, oku('Randevular'), oku('Kapanislar'));
  if (hata) return { ok: false, error: hata };
  var rec = {
    kod: yeniKod(), olusturma: simdi(), durum: 'beklemede', tarih: b.tarih, oturum: b.oturum,
    adSoyad: temiz(b.adSoyad), okul: temiz(b.okul), il: AYAR.IL, ilce: b.ilce, kisi: String(Number(b.kisi)),
    telefon: telefonRakam(b.telefon), eposta: temiz(b.eposta), aciklama: temiz(b.aciklama, 600), not: '', islemTarihi: ''
  };
  ekle('Randevular', rec);
  try {
    eposta(rec.eposta, 'Randevu talebiniz alındı – ' + rec.kod,
      'Sayın ' + rec.adSoyad + ',<br><br>' + AYAR.LAB_ADI + ' için randevu talebiniz alınmıştır. Talebiniz incelendikten sonra sonuç bu adrese bildirilecektir.' + ozet(rec));
    var admin = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL');
    if (admin) eposta(admin, 'Yeni randevu talebi: ' + rec.okul + ' – ' + trTarih(rec.tarih),
      'Onay bekleyen yeni bir randevu talebi var.' + ozet(rec) + '<p>Telefon: ' + rec.telefon + '<br>E-posta: ' + rec.eposta + '</p>');
  } catch (err) { /* e-posta gönderilemese de kayıt geçerli */ }
  return { ok: true, kod: rec.kod };
}

function randevuBul(kod) {
  kod = String(kod || '').trim().toUpperCase();
  var b = oku('Randevular').filter(function (x) { return x.kod === kod; })[0];
  if (!b) return { ok: false, error: 'Bu kodla bir randevu bulunamadı.' };
  if (b.durum !== 'onaylandi') return { ok: false, error: 'Bu randevu onaylanmış görünmüyor.' };
  return { ok: true, randevu: { adSoyad: b.adSoyad, okul: b.okul, ilce: b.ilce, tarih: b.tarih, oturum: b.oturum, kisi: Number(b.kisi) } };
}

function raporKaydet(r) {
  var hata = raporDogrula(r);
  if (hata) return { ok: false, error: hata };
  ekle('Raporlar', {
    id: 'R' + new Date().getTime(), olusturma: simdi(), kod: temiz(r.kod).toUpperCase(), tarih: r.tarih, oturum: r.oturum,
    adSoyad: temiz(r.adSoyad), okul: temiz(r.okul), il: AYAR.IL, ilce: r.ilce, kademe: temiz(r.kademe),
    ogrenci: String(Number(r.ogrenci)), kiz: String(Number(r.kiz)), erkek: String(Number(r.erkek)),
    aciklama: temiz(r.aciklama, 1000), araclar: (r.araclar || []).join(','), aracAdlari: (r.aracAdlari || []).join(', ')
  });
  return { ok: true };
}

function yoneticiListe() {
  var rap = oku('Raporlar').map(function (r) {
    r.araclar = r.araclar ? String(r.araclar).split(',') : [];
    ['ogrenci', 'kiz', 'erkek'].forEach(function (f) { r[f] = Number(r[f]) || 0; });
    return r;
  });
  var ran = oku('Randevular').map(function (b) { b.kisi = Number(b.kisi) || 0; return b; });
  return { ok: true, randevular: ran, raporlar: rap, kapanislar: oku('Kapanislar'), eposta: true };
}

function durumDegistir(d) {
  var sh = sayfa('Randevular'), rows = oku('Randevular', true);
  var hit = rows.filter(function (x) { return x.kod === d.kod; })[0];
  if (!hit) return { ok: false, error: 'Randevu bulunamadı.' };
  if (['onaylandi', 'reddedildi', 'iptal'].indexOf(d.durum) < 0) return { ok: false, error: 'Geçersiz durum.' };
  if (d.durum === 'onaylandi' && rows.some(function (x) { return x.kod !== hit.kod && x.tarih === hit.tarih && x.oturum === hit.oturum && x.durum === 'onaylandi'; }))
    return { ok: false, error: 'Bu oturum için onaylanmış başka bir randevu var.' };
  var h = SAYFALAR.Randevular;
  sh.getRange(hit._satir, h.indexOf('durum') + 1).setValue(d.durum);
  sh.getRange(hit._satir, h.indexOf('not') + 1).setValue(temiz(d.not, 500));
  sh.getRange(hit._satir, h.indexOf('islemTarihi') + 1).setValue(simdi());
  hit.durum = d.durum;
  var gonderildi = true;
  try {
    var notHtml = d.not ? '<p><b>Not:</b> ' + kacis(d.not) + '</p>' : '';
    if (d.durum === 'onaylandi')
      eposta(hit.eposta, 'Randevunuz onaylandı – ' + hit.kod, 'Sayın ' + hit.adSoyad + ',<br><br>' + AYAR.LAB_ADI + ' randevunuz <b>onaylanmıştır</b>.' + ozet(hit) + notHtml +
        '<p>Etkinliğinizden sonra sitedeki <b>Etkinlik Raporu</b> formunu doldururken randevu kodunuzu (<b>' + hit.kod + '</b>) kullanabilirsiniz.</p>');
    else if (d.durum === 'reddedildi')
      eposta(hit.eposta, 'Randevu talebiniz hakkında – ' + hit.kod, 'Sayın ' + hit.adSoyad + ',<br><br>Aşağıdaki randevu talebiniz maalesef <b>onaylanamamıştır</b>.' + ozet(hit) + notHtml +
        '<p>Takvimden başka bir oturum seçerek yeniden talepte bulunabilirsiniz.</p>');
    else
      eposta(hit.eposta, 'Randevunuz iptal edildi – ' + hit.kod, 'Sayın ' + hit.adSoyad + ',<br><br>Aşağıdaki randevunuz <b>iptal edilmiştir</b>.' + ozet(hit) + notHtml +
        '<p>Takvimden başka bir oturum seçerek yeniden talepte bulunabilirsiniz.</p>');
  } catch (err) { gonderildi = false; }
  return { ok: true, eposta: gonderildi };
}

function kapat(d) {
  var t = d.tarihler || [];
  if (!t.length) return { ok: false, error: 'Tarih seçilmedi.' };
  if (['tum', 'sabah', 'ogle'].indexOf(d.oturum) < 0) return { ok: false, error: 'Geçersiz kapsam.' };
  t.forEach(function (tarih, i) { ekle('Kapanislar', { id: 'K' + new Date().getTime() + '_' + i, tarih: tarih, oturum: d.oturum, neden: temiz(d.neden, 200), olusturma: simdi() }); });
  return { ok: true };
}

function yenidenAc(d) {
  var sh = sayfa('Kapanislar'), hit = oku('Kapanislar', true).filter(function (c) { return c.id === d.id; })[0];
  if (!hit) return { ok: false, error: 'Kayıt bulunamadı.' };
  sh.deleteRow(hit._satir);
  return { ok: true };
}

/* ---------- Kurallar (sitedeki api.js ile aynı) ---------- */
function randevuDogrula(b, randevular, kapanislar) {
  var req = ['tarih', 'oturum', 'adSoyad', 'okul', 'ilce', 'kisi', 'telefon', 'eposta'];
  for (var i = 0; i < req.length; i++) if (!String(b[req[i]] == null ? '' : b[req[i]]).trim()) return 'Lütfen tüm zorunlu alanları doldurun.';
  if (!b.kvkk) return 'Devam etmek için KVKK aydınlatma metnini onaylamanız gerekir.';
  if (AYAR.ILCELER.indexOf(b.ilce) < 0) return 'Lütfen listeden bir ilçe seçin.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(b.eposta).trim())) return 'E-posta adresi geçerli görünmüyor.';
  if (!/^05\d{9}$/.test(telefonRakam(b.telefon))) return 'Telefon numarasını 05XX XXX XX XX biçiminde yazın.';
  var kisi = Number(b.kisi);
  if (!(kisi % 1 === 0) || kisi < 1) return 'Katılımcı sayısı en az 1 olmalıdır.';
  if (kisi > AYAR.KAPASITE) return 'Sınıf kapasitesi ' + AYAR.KAPASITE + ' kişi ile sınırlıdır. ' + kisi + ' kişilik grup için randevu onaylanamaz.';
  if (!AYAR.OTURUMLAR[b.oturum]) return 'Geçersiz oturum.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.tarih)) return 'Geçersiz tarih.';
  var d = anahtardanTarih(b.tarih), gun = d.getDay(), bugun = anahtardanTarih(bugunAnahtar());
  if (gun === 0 || gun === 6) return 'Randevular yalnızca pazartesi–cuma günleri için alınabilir.';
  if (d < gunEkle(bugun, AYAR.EN_ERKEN_GUN)) return 'Bu tarih için artık randevu alınamaz.';
  if (d > gunEkle(bugun, AYAR.EN_GEC_HAFTA * 7)) return 'Bu tarih henüz randevuya açılmadı.';
  if (AYAR.SABIT_TATILLER[b.tarih.slice(5)]) return 'Seçilen gün resmî tatildir.';
  if (kapanislar.some(function (c) { return c.tarih === b.tarih && (c.oturum === 'tum' || c.oturum === b.oturum); })) return 'Seçilen oturum kullanıma kapatılmıştır.';
  if (randevular.some(function (x) { return x.tarih === b.tarih && x.oturum === b.oturum && AKTIF.indexOf(x.durum) > -1; }))
    return 'Seçilen oturum dolu. Lütfen başka bir oturum seçin.';
  var hafta = anahtar(pazartesi(d)), mail = String(b.eposta).trim().toLowerCase(), tel = telefonRakam(b.telefon);
  if (randevular.some(function (x) {
    return AKTIF.indexOf(x.durum) > -1 && anahtar(pazartesi(anahtardanTarih(x.tarih))) === hafta &&
      (String(x.eposta).toLowerCase() === mail || telefonRakam(x.telefon) === tel);
  })) return 'Aynı hafta içinde yalnızca bir oturum için randevu alabilirsiniz. Bu hafta için kayıtlı bir talebiniz bulunuyor.';
  return null;
}

function raporDogrula(r) {
  var req = ['okul', 'ilce', 'adSoyad', 'kademe', 'tarih', 'oturum', 'ogrenci', 'kiz', 'erkek', 'aciklama'];
  for (var i = 0; i < req.length; i++) if (!String(r[req[i]] == null ? '' : r[req[i]]).trim()) return 'Lütfen tüm zorunlu alanları doldurun.';
  if (!r.kvkk) return 'Devam etmek için KVKK aydınlatma metnini onaylamanız gerekir.';
  if (AYAR.ILCELER.indexOf(r.ilce) < 0) return 'Lütfen listeden bir ilçe seçin.';
  var f = ['ogrenci', 'kiz', 'erkek'];
  for (var j = 0; j < f.length; j++) { var n = Number(r[f[j]]); if (!(n % 1 === 0) || n < 0) return 'Öğrenci sayıları 0 veya daha büyük bir tam sayı olmalıdır.'; }
  if (!r.araclar || !r.araclar.length) return 'Lütfen kullanılan en az bir aracı seçin.';
  return null;
}

/* ---------- Yardımcılar ---------- */
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function sayfa(ad) { return SpreadsheetApp.getActive().getSheetByName(ad); }
function kilitle(fn) {
  var l = LockService.getScriptLock();
  if (!l.tryLock(20000)) return { ok: false, error: 'Sistem şu anda yoğun, lütfen birkaç saniye sonra tekrar deneyin.' };
  try { return fn(); } finally { l.releaseLock(); }
}
function oku(ad, satirli) {
  var sh = sayfa(ad), h = SAYFALAR[ad], son = sh.getLastRow();
  if (son < 2) return [];
  return sh.getRange(2, 1, son - 1, h.length).getValues().map(function (r, i) {
    var o = {};
    h.forEach(function (k, j) {
      var v = r[j];
      o[k] = v instanceof Date ? Utilities.formatDate(v, AYAR.SAAT_DILIMI, k === 'tarih' ? 'yyyy-MM-dd' : "yyyy-MM-dd'T'HH:mm:ss") : String(v);
    });
    if (satirli) o._satir = i + 2;
    return o;
  }).filter(function (o) { return o[h[0]]; });
}
function ekle(ad, o) { var sh = sayfa(ad); sh.appendRow(SAYFALAR[ad].map(function (k) { return o[k] == null ? '' : String(o[k]); })); }
function sifreDogru(s) { var p = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD'); return !!p && s === p; }
function temiz(s, max) { s = String(s == null ? '' : s).trim(); if (/^[=+\-@]/.test(s)) s = "'" + s; return max ? s.slice(0, max) : s; } // formül enjeksiyonunu önler
function kacis(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function telefonRakam(p) { var d = String(p || '').replace(/\D/g, '').replace(/^90/, ''); return d.charAt(0) === '0' ? d : '0' + d; }
function yeniKod() { var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = 'CTL-'; for (var i = 0; i < 6; i++) s += a.charAt(Math.floor(Math.random() * a.length)); return s; }
function simdi() { return Utilities.formatDate(new Date(), AYAR.SAAT_DILIMI, "yyyy-MM-dd'T'HH:mm:ss"); }
function bugunAnahtar() { return Utilities.formatDate(new Date(), AYAR.SAAT_DILIMI, 'yyyy-MM-dd'); }
function anahtardanTarih(k) { var p = String(k).split('-'); return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])); }
function anahtar(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
function gunEkle(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
function pazartesi(d) { return gunEkle(d, -((d.getDay() + 6) % 7)); }
function trTarih(k) {
  var ay = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var gn = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  var d = anahtardanTarih(k); return d.getDate() + ' ' + ay[d.getMonth()] + ' ' + d.getFullYear() + ' ' + gn[d.getDay()];
}
function ozet(b) {
  return '<table style="margin:16px 0;border-collapse:collapse;font-size:14px">' +
    [['Randevu kodu', b.kod], ['Tarih', trTarih(b.tarih)], ['Oturum', AYAR.OTURUMLAR[b.oturum]], ['Okul', b.okul + ' (' + b.ilce + ')'], ['Katılımcı sayısı', b.kisi], ['Yer', AYAR.ADRES]]
      .map(function (r) { return '<tr><td style="padding:4px 14px 4px 0;color:#5E5878">' + r[0] + '</td><td style="padding:4px 0"><b>' + kacis(r[1]) + '</b></td></tr>'; }).join('') + '</table>';
}
function eposta(to, konu, html) {
  MailApp.sendEmail({
    to: to, subject: konu, name: AYAR.LAB_ADI,
    htmlBody: '<div style="font-family:Arial,sans-serif;color:#1B1530;max-width:560px">' +
      '<div style="background:#2C3FBF;color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;font-weight:bold">' + AYAR.LAB_ADI + '</div>' +
      '<div style="border:1px solid #E6E1F2;border-top:0;padding:20px;border-radius:0 0 8px 8px">' + html +
      '<p style="color:#5E5878;font-size:12px;margin-top:24px">' + AYAR.KURUM + '<br>Bu e-posta otomatik olarak gönderilmiştir.</p></div></div>'
  });
}
