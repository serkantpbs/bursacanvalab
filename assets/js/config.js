/* ==========================================================
   Canva Tasarım Laboratuvarı — Site ayarları
   Bu dosyadaki değerleri kendi kurulumunuza göre değiştirin.
   ========================================================== */
window.LAB_CONFIG = {
  /* Google Apps Script web uygulaması adresi.
     BOŞ bırakılırsa site "demo modunda" çalışır: veriler yalnızca
     kullanılan tarayıcıda saklanır (GitHub önizlemesi için uygundur).
     Örnek: "https://script.google.com/macros/s/AKfy..../exec" */
  APPS_SCRIPT_URL: "",

  /* Demo modundaki yönetim paneli şifresi (gerçek kurulumda şifre
     Apps Script'teki Komut Dosyası Özellikleri'nde tutulur). */
  DEMO_ADMIN_PASSWORD: "demo1234",

  LAB_ADI: "Canva Tasarım Laboratuvarı",
  KURUM: "Bursa İl Millî Eğitim Müdürlüğü",
  SUBE: "Yenilik ve Eğitim Teknolojileri Hizmetleri Şubesi",
  ADRES: "BTSO Eğitim Vadisi YEĞİTEK Hizmetleri Şubesi",
  ILETISIM_EPOSTA: "",          /* örn. "canvalab@meb.gov.tr" — boşsa gösterilmez */
  ILETISIM_TELEFON: "",
  LOGO: "assets/img/logo.png",  /* Logo dosyası yoksa yalnızca yazı görünür */

  IL: "Bursa",
  KAPASITE: 35,                 /* Bu sayının üzerindeki başvurular kabul edilmez */
  BILGISAYAR_SAYISI: 20,

  OTURUMLAR: [
    { id: "sabah", ad: "Sabah oturumu", saat: "09.30 – 12.30" },
    { id: "ogle",  ad: "Öğleden sonra oturumu", saat: "13.30 – 16.30" }
  ],

  EN_ERKEN_GUN: 1,              /* En erken kaç gün sonrası için randevu alınabilir */
  EN_GEC_HAFTA: 8               /* Kaç hafta ilerisine kadar randevu açık */
};
