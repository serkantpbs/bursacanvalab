/* ==========================================================
   Canva Tasarım Laboratuvarı — İçerik verileri
   Görselleri, açıklamaları ve PDF yollarını buradan ekleyin.
   ========================================================== */

window.LAB_DATA = {

  ILCELER: ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey",
    "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi",
    "Osmangazi", "Yenişehir", "Yıldırım"],

  KADEMELER: ["İlkokul", "Ortaokul", "Lise"],

  /* Her yıl aynı tarihe denk gelen resmî tatiller (AA-GG). Hafta içine denk gelirse
     takvimde otomatik "Kapalı" görünür. Dinî bayramları ve idari izinleri
     yönetim panelindeki "Gün / oturum kapat" bölümünden kapatın. */
  SABIT_TATILLER: {
    "01-01": "Yılbaşı",
    "04-23": "Ulusal Egemenlik ve Çocuk Bayramı",
    "05-01": "Emek ve Dayanışma Günü",
    "05-19": "Atatürk'ü Anma, Gençlik ve Spor Bayramı",
    "07-15": "Demokrasi ve Millî Birlik Günü",
    "08-30": "Zafer Bayramı",
    "10-29": "Cumhuriyet Bayramı"
  },

  ALT_SISTEMLER: [
    { id: "yz",    ad: "Yapay Zekâ",                renk: "#7D2AE8" },
    { id: "sanat", ad: "Sanat ve Multimedya",       renk: "#E8467C" },
    { id: "kod",   ad: "Kodlama ve Robotik",        renk: "#00A7B5" },
    { id: "sinif", ad: "Dijital Sınıf",             renk: "#3B6FF5" },
    { id: "bilim", ad: "Bilim ve Sürdürülebilirlik", renk: "#2BA84A" }
  ],

  /* Ana malzemeler.
     gorsel : "assets/img/araclar/dosya.jpg"  (boşsa renkli simge görünür)
     aciklama: kısa tanıtım metni
     pdf    : "materyaller/dosya.pdf"         (boşsa "Yakında" görünür)        */
  ARACLAR: [
    // Yapay Zekâ
    { id: "botnroll",      alt: "yz", ad: "Bot'n Roll ONE A+",               gorsel: "", aciklama: "", pdf: "" },
    { id: "ukit-ai",       alt: "yz", ad: "UBTECH uKit AI Smart Life",       gorsel: "", aciklama: "", pdf: "" },
    { id: "ukit-explore",  alt: "yz", ad: "UBTECH uKit Explore",             gorsel: "", aciklama: "", pdf: "" },
    { id: "rpi5",          alt: "yz", ad: "Raspberry Pi 5",                  gorsel: "", aciklama: "", pdf: "" },
    { id: "rpi-ai",        alt: "yz", ad: "Raspberry Pi AI Kit (Hailo-8L)",  gorsel: "", aciklama: "", pdf: "" },
    { id: "unihiker",      alt: "yz", ad: "UNIHIKER M10",                    gorsel: "", aciklama: "", pdf: "" },
    // Sanat ve Multimedya
    { id: "canon",         alt: "sanat", ad: "Canon EOS R100 Fotoğraf Makinesi", gorsel: "", aciklama: "", pdf: "" },
    { id: "insta360",      alt: "sanat", ad: "Insta360 X3 360° Kamera",       gorsel: "", aciklama: "", pdf: "" },
    { id: "rode",          alt: "sanat", ad: "Rode VideoMic Kamera Mikrofonu", gorsel: "", aciklama: "", pdf: "" },
    { id: "saramonic",     alt: "sanat", ad: "Saramonic Blink 500 B2 Yaka Mikrofonu", gorsel: "", aciklama: "", pdf: "" },
    { id: "shure",         alt: "sanat", ad: "Shure SM58 Mikrofon Seti",      gorsel: "", aciklama: "", pdf: "" },
    { id: "zoomh5",        alt: "sanat", ad: "Zoom H5 Ses Kaydedici",         gorsel: "", aciklama: "", pdf: "" },
    { id: "wacom",         alt: "sanat", ad: "Wacom Intuos S Grafik Tablet",  gorsel: "", aciklama: "", pdf: "" },
    { id: "vive",          alt: "sanat", ad: "HTC VIVE Focus Vision VR Gözlük", gorsel: "", aciklama: "", pdf: "" },
    { id: "roland",        alt: "sanat", ad: "Roland V-02HD MK II Video Mikseri", gorsel: "", aciklama: "", pdf: "" },
    { id: "teleprompter",  alt: "sanat", ad: "Datavideo TP-500 Teleprompter", gorsel: "", aciklama: "", pdf: "" },
    { id: "yamaha",        alt: "sanat", ad: "Yamaha STAGEPAS 400BT Ses Sistemi", gorsel: "", aciklama: "", pdf: "" },
    { id: "isik",          alt: "sanat", ad: "Fotoğraf Stüdyosu Işık Kiti",   gorsel: "", aciklama: "", pdf: "" },
    // Kodlama ve Robotik
    { id: "arduino",       alt: "kod", ad: "Arduino Başlangıç Kiti",          gorsel: "", aciklama: "", pdf: "" },
    { id: "sensor48",      alt: "kod", ad: "48'li Sensör ve Modül Kiti",      gorsel: "", aciklama: "", pdf: "" },
    { id: "lehim",         alt: "kod", ad: "Pro'sKit Lehim İstasyonu",        gorsel: "", aciklama: "", pdf: "" },
    { id: "multimetre",    alt: "kod", ad: "Pro'sKit Dijital Multimetre",     gorsel: "", aciklama: "", pdf: "" },
    { id: "akilli-ev",     alt: "kod", ad: "Akıllı Ev Kiti",                  gorsel: "", aciklama: "", pdf: "" },
    { id: "cizgi-robot",   alt: "kod", ad: "Çizgi İzleyen ve Engelden Kaçan Robot Kiti", gorsel: "", aciklama: "", pdf: "" },
    { id: "airbit",        alt: "kod", ad: "Air:bit 2 Eğitsel Drone",         gorsel: "", aciklama: "", pdf: "" },
    { id: "vex",           alt: "kod", ad: "VEX CTE Workcell Akıllı Fabrika Kiti", gorsel: "", aciklama: "", pdf: "" },
    { id: "microbit",      alt: "kod", ad: "BBC micro:bit ve Kitronik Mucit Kiti", gorsel: "", aciklama: "", pdf: "" },
    { id: "microbit-sens", alt: "kod", ad: "micro:bit Sensör ve Modül Kiti",  gorsel: "", aciklama: "", pdf: "" },
    // Dijital Sınıf
    { id: "dizustu",       alt: "sinif", ad: "Dizüstü Bilgisayarlar (20 adet)", gorsel: "", aciklama: "", pdf: "" },
    { id: "panel",         alt: "sinif", ad: "Traulux 86″ Etkileşimli Panel", gorsel: "", aciklama: "", pdf: "" },
    { id: "sarj-dolabi",   alt: "sinif", ad: "Traulux Dizüstü Şarj Dolabı",   gorsel: "", aciklama: "", pdf: "" },
    { id: "yazici3b",      alt: "sinif", ad: "Elegoo Neptune 4 3B Yazıcı",    gorsel: "", aciklama: "", pdf: "" },
    // Bilim ve Sürdürülebilirlik
    { id: "optika",        alt: "bilim", ad: "Optika B-190TBPL Dijital Mikroskop", gorsel: "", aciklama: "", pdf: "" },
    { id: "usb-mikroskop", alt: "bilim", ad: "Taşınabilir USB Dijital Mikroskop", gorsel: "", aciklama: "", pdf: "" },
    { id: "teleskop",      alt: "bilim", ad: "Bresser Spica 130/650 Teleskop", gorsel: "", aciklama: "", pdf: "" },
    { id: "enerji-kit",    alt: "bilim", ad: "Horizon Yenilenebilir Enerji Bilim Kiti", gorsel: "", aciklama: "", pdf: "" },
    { id: "enerji-olcum",  alt: "bilim", ad: "Horizon Yenilenebilir Enerji Ölçüm Cihazı", gorsel: "", aciklama: "", pdf: "" },
    { id: "mobilite",      alt: "bilim", ad: "Horizon Elektrikli Mobilite Deney Seti", gorsel: "", aciklama: "", pdf: "" },
    { id: "lark",          alt: "bilim", ad: "DFRobot Lark Hava İstasyonu",   gorsel: "", aciklama: "", pdf: "" }
  ],

  /* Sınıf fotoğrafları: { src: "assets/img/galeri/1.jpg", baslik: "Genel görünüm" } */
  GALERI: [],

  /* 360° sahneler (eş dikdörtgensel / equirectangular görsel, ör. Insta360 çıktısı).
     sicakNoktalar: görsel üzerindeki tıklanabilir noktalar.
       pitch: dikey açı (-90..90), yaw: yatay açı (-180..180),
       metin: üzerine gelince görünen yazı, arac: ARACLAR içindeki id               */
  SAHNELER: [
    {
      id: "giris",
      baslik: "Laboratuvar girişi (örnek görsel)",
      gorsel: "assets/img/360/ornek-panorama.jpg",
      sicakNoktalar: [
        { pitch: -6, yaw: 0,   metin: "Örnek nokta: Etkileşimli panel", arac: "panel" },
        { pitch: -12, yaw: 90, metin: "Örnek nokta: Dizüstü bilgisayarlar", arac: "dizustu" }
      ]
    }
  ]
};
