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
    { id: "yz",    ad: "Yapay Zekâ",                renk: "#6B3FC9" },
    { id: "sanat", ad: "Sanat ve Multimedya",       renk: "#C23E70" },
    { id: "kod",   ad: "Kodlama ve Robotik",        renk: "#13838C" },
    { id: "sinif", ad: "Dijital Sınıf",             renk: "#2C3FBF" },
    { id: "bilim", ad: "Bilim ve Sürdürülebilirlik", renk: "#2E8B4E" }
  ],

  /* Ana malzemeler.
     gorsel : "assets/img/araclar/dosya.jpg"  (boşsa renkli simge görünür)
     aciklama: kısa tanıtım metni
     pdf    : "materyaller/dosya.pdf"         (boşsa "Yakında" görünür)        */
  ARACLAR: [
    // Yapay Zekâ
    { id: "botnroll",      alt: "yz", ad: "Bot'n Roll ONE A+",               gorsel: "assets/img/araclar/botnroll.jpg", aciklama: "Arduino uyumlu, tekerlekli eğitim robotu. Motor, ışık ve mesafe sensörlerini blok ya da C++ koduyla programlayarak robotun nasıl karar verdiğini öğrencilerle birlikte keşfedebilirsiniz.", pdf: "materyaller/botnroll.pdf" },
    { id: "ukit-ai",       alt: "yz", ad: "UBTECH uKit AI Smart Life",       gorsel: "assets/img/araclar/ukit-ai.jpg", aciklama: "Parçalarını öğrencilerin birleştirdiği, yüz ve ses tanıma özellikli robot yapım seti. Blok tabanlı kodlamayla ortaokul düzeyinde yapay zekâya ilk adımı atmak için uygundur.", pdf: "materyaller/ukit-ai.pdf" },
    { id: "ukit-explore",  alt: "yz", ad: "UBTECH uKit Explore",             gorsel: "assets/img/araclar/ukit-explore.jpg", aciklama: "Arduino tabanlı ileri seviye robot seti; servo motorlarla insansı robotlara kadar farklı modeller kurulabilir. Blok kodlamadan C/C++'a geçiş için iyi bir köprüdür.", pdf: "materyaller/ukit-explore.pdf" },
    { id: "rpi5",          alt: "yz", ad: "Raspberry Pi 5",                  gorsel: "assets/img/araclar/rpi5.jpg", aciklama: "Kredi kartı büyüklüğünde, tam donanımlı bir bilgisayar. Python ile kodlama, sensörlerle veri toplama ve yapay zekâ projeleri için laboratuvarın temel kartıdır.", pdf: "materyaller/rpi5.pdf" },
    { id: "rpi-ai",        alt: "yz", ad: "Raspberry Pi AI Kit (Hailo-8L)",  gorsel: "assets/img/araclar/rpi-ai.jpg", aciklama: "Raspberry Pi 5'e takılan Hailo-8L yapay zekâ hızlandırıcısı. Kamera görüntüsünde nesne ve insan tanıma gibi uygulamaları gerçek zamanlı çalıştırır.", pdf: "materyaller/rpi-ai.pdf" },
    { id: "unihiker",      alt: "yz", ad: "UNIHIKER M10",                    gorsel: "assets/img/araclar/unihiker.jpg", aciklama: "Dokunmatik ekranı, düğmeleri ve sensörleri üzerinde bulunan, Python ile programlanan küçük bir bilgisayar. Ek parça gerektirmeden IoT ve yapay zekâ projelerine başlamayı sağlar.", pdf: "materyaller/unihiker.pdf", ekler: [{ ad: "UNIHIKER M10 ile Kodlama (ders serisi)", pdf: "materyaller/unihiker-kodlama.pdf" }] },
    // Sanat ve Multimedya
    { id: "canon",         alt: "sanat", ad: "Canon EOS R100 Fotoğraf Makinesi", gorsel: "", aciklama: "Değiştirilebilir lensli aynasız fotoğraf makinesi. Haber, belgesel ve ürün fotoğrafçılığı çalışmalarının yanı sıra video çekimlerinde de kullanılır.", pdf: "materyaller/canon.pdf" },
    { id: "insta360",      alt: "sanat", ad: "Insta360 X3 360° Kamera",       gorsel: "assets/img/araclar/insta360.jpg", aciklama: "Her yönü aynı anda kaydeden 360 derecelik kamera. Sanal tur, sanal gerçeklik içeriği ve farklı açılardan anlatım yapan videolar hazırlamak için kullanılır.", pdf: "materyaller/insta360.pdf" },
    { id: "rode",          alt: "sanat", ad: "Rode VideoMic Kamera Mikrofonu", gorsel: "assets/img/araclar/rode.jpg", aciklama: "Kameranın üzerine takılan yönlü mikrofon seti; rüzgârlık, tabanca kabzası ve boom çubuğuyla birlikte gelir. Röportaj ve dış çekimlerde sesi temiz kaydeder.", pdf: "materyaller/rode.pdf" },
    { id: "saramonic",     alt: "sanat", ad: "Saramonic Blink 500 B2 Yaka Mikrofonu", gorsel: "assets/img/araclar/saramonic.jpg", aciklama: "İki kişilik kablosuz yaka mikrofonu. Telefon ya da kamerayla yapılan röportaj, sunum ve podcast çekimlerinde konuşmacıların sesini net alır.", pdf: "materyaller/saramonic.pdf" },
    { id: "shure",         alt: "sanat", ad: "Shure SM58 Mikrofon Seti",      gorsel: "assets/img/araclar/shure.jpg", aciklama: "Kablolu dinamik mikrofon ve tripod sehpası. Sınıf içi sunumlar, canlı yayınlar ve ses sistemiyle yapılan etkinliklerde kullanılır.", pdf: "materyaller/shure.pdf" },
    { id: "zoomh5",        alt: "sanat", ad: "Zoom H5 Ses Kaydedici",         gorsel: "assets/img/araclar/zoomh5.jpg", aciklama: "Dört kanallı taşınabilir ses kaydedici. Podcast, radyo tiyatrosu ve saha kayıtları için kameradan bağımsız kaliteli ses kaydı alır.", pdf: "materyaller/zoomh5.pdf" },
    { id: "wacom",         alt: "sanat", ad: "Wacom Intuos S Grafik Tablet",  gorsel: "assets/img/araclar/wacom.jpg", aciklama: "Basınca duyarlı kalemi olan grafik tablet. Canva ve çizim programlarında elle çizim, karakter tasarımı ve dijital illüstrasyon için kullanılır.", pdf: "materyaller/wacom.pdf" },
    { id: "vive",          alt: "sanat", ad: "HTC VIVE Focus Vision VR Gözlük", gorsel: "assets/img/araclar/vive.jpg", aciklama: "Tek başına ya da bilgisayara bağlanarak çalışan sanal gerçeklik gözlüğü. Öğrencilerin ürettiği 360° içerikleri ve eğitsel VR uygulamalarını deneyimlemek için kullanılır.", pdf: "materyaller/vive.pdf" },
    { id: "roland",        alt: "sanat", ad: "Roland V-02HD MK II Video Mikseri", gorsel: "assets/img/araclar/roland.jpg", aciklama: "İki kameradan gelen görüntüyü birleştiren video mikseri. Okul yayınları, canlı etkinlik aktarımı ve stüdyo çekimlerinde kameralar arasında geçiş yapar.", pdf: "materyaller/roland.pdf" },
    { id: "teleprompter",  alt: "sanat", ad: "Datavideo TP-500 Teleprompter", gorsel: "", aciklama: "Kameranın önüne takılan ve metni tabletten yansıtan sistem. Haber bülteni ve sunum videolarında öğrencilerin kameraya bakarak konuşmasını sağlar.", pdf: "materyaller/teleprompter.pdf" },
    { id: "yamaha",        alt: "sanat", ad: "Yamaha STAGEPAS 400BT Ses Sistemi", gorsel: "assets/img/araclar/yamaha.jpg", aciklama: "Sekiz kanallı mikser ve iki hoparlörden oluşan taşınabilir ses sistemi. Etkinlik, sunum ve gösterilerde mikrofon sesini ve müziği salona yayar.", pdf: "materyaller/yamaha.pdf" },
    { id: "isik",          alt: "sanat", ad: "Fotoğraf Stüdyosu Işık Kiti",   gorsel: "assets/img/araclar/isik.jpg", aciklama: "Fon sistemi, softbox ve şemsiye ışıklardan oluşan taşınabilir stüdyo. Yeşil perde çekimleri, ürün ve portre fotoğrafları için kullanılır.", pdf: "materyaller/isik.pdf" },
    // Kodlama ve Robotik
    { id: "arduino",       alt: "kod", ad: "Arduino Başlangıç Kiti",          gorsel: "assets/img/araclar/arduino.jpg", aciklama: "UNO uyumlu kart ve devre elemanlarından oluşan, elektroniğe ve kodlamaya giriş seti. LED yakmaktan sensörlü projelere uzanan 28 proje içerir.", pdf: "materyaller/arduino.pdf" },
    { id: "sensor48",      alt: "kod", ad: "48'li Sensör ve Modül Kiti",      gorsel: "assets/img/araclar/sensor48.jpg", aciklama: "Işık, ses, hareket, sıcaklık ve mesafe gibi 48 farklı sensör ve modül. Arduino kartıyla birlikte kullanılarak akıllı sistem projeleri geliştirilir.", pdf: "materyaller/sensor48.pdf" },
    { id: "lehim",         alt: "kod", ad: "Pro'sKit Lehim İstasyonu",        gorsel: "assets/img/araclar/lehim.jpg", aciklama: "Sıcaklığı ayarlanabilen lehim istasyonu. Elektronik projelerde kalıcı bağlantılar kurmak için, öğretmen gözetiminde ve güvenlik kurallarıyla kullanılır.", pdf: "materyaller/lehim.pdf" },
    { id: "multimetre",    alt: "kod", ad: "Pro'sKit Dijital Multimetre",     gorsel: "assets/img/araclar/multimetre.jpg", aciklama: "Gerilim, akım ve direnç ölçen el multimetresi. Devrelerdeki hataları bulmak ve fen derslerinde elektrik ölçümleri yapmak için kullanılır.", pdf: "materyaller/multimetre.pdf" },
    { id: "akilli-ev",     alt: "kod", ad: "Akıllı Ev Kiti",                  gorsel: "assets/img/araclar/akilli-ev.jpg", aciklama: "Ahşap maket ev üzerinde sensörler, motorlar ve Arduino ile çalışan akıllı ev kiti. Işık, kapı ve alarm sistemlerini telefonla yönetmeyi öğretir.", pdf: "materyaller/akilli-ev.pdf" },
    { id: "cizgi-robot",   alt: "kod", ad: "Çizgi İzleyen ve Engelden Kaçan Robot Kiti", gorsel: "assets/img/araclar/cizgi-robot.jpg", aciklama: "Bot'n Roll robotuyla çizgi izleme ve engelden kaçma uygulamaları. Sensör okuma, kalibrasyon ve otonom hareket konuları adım adım çalışılır.", pdf: "materyaller/cizgi-robot.pdf" },
    { id: "airbit",        alt: "kod", ad: "Air:bit 2 Eğitsel Drone",         gorsel: "assets/img/araclar/airbit.jpg", aciklama: "micro:bit ile kurulan, kodlanan ve uçurulan dört pervaneli eğitsel drone. Öğrenciler gövdeyi kendileri birleştirir ve uçuş kodunu yazar.", pdf: "materyaller/airbit.pdf" },
    { id: "codrone",       alt: "kod", ad: "CoDrone EDU Programlanabilir Drone", gorsel: "assets/img/araclar/codrone.jpg", aciklama: "Blok ya da Python ile programlanan mini eğitim dronu ve kumandası. Kalkış, iniş ve rota komutlarıyla kapalı alanda güvenli uçuş görevleri yapılır.", pdf: "" },
    { id: "vex",           alt: "kod", ad: "VEX CTE Workcell Akıllı Fabrika Kiti", gorsel: "assets/img/araclar/vex.jpg", aciklama: "Altı eksenli robot kol, konveyörler, sensörler ve pnömatik parçalarla küçük bir akıllı fabrika. Lise düzeyinde endüstriyel otomasyon çalışmaları için uygundur.", pdf: "materyaller/vex.pdf" },
    { id: "microbit",      alt: "kod", ad: "BBC micro:bit ve Kitronik Mucit Kiti", gorsel: "assets/img/araclar/microbit.jpg", aciklama: "micro:bit V2 kartı ve Kitronik deney seti. Deneylerle ilkokul ve ortaokul düzeyinde kodlamaya ve elektroniğe güvenli bir giriş yapılır.", pdf: "materyaller/microbit.pdf" },
    { id: "microbit-sens", alt: "kod", ad: "micro:bit Sensör ve Modül Kiti",  gorsel: "assets/img/araclar/microbit-sens.jpg", aciklama: "micro:bit için genişletme kartı, sensörler ve göstergeler. Hava durumu, alarm ve oyun gibi projelerde micro:bit'in yeteneklerini artırır.", pdf: "materyaller/microbit-sens.pdf" },
    // Dijital Sınıf
    { id: "dizustu",       alt: "sinif", ad: "Dizüstü Bilgisayarlar (20 adet)", gorsel: "", aciklama: "Laboratuvardaki 20 dizüstü bilgisayar. Canva, kodlama ortamları ve araçların yazılımları bu bilgisayarlarda kullanılır; şarj dolabında saklanır.", pdf: "" },
    { id: "panel",         alt: "sinif", ad: "Traulux 86″ Etkileşimli Panel", gorsel: "assets/img/araclar/panel.jpg", aciklama: "86 inç dokunmatik etkileşimli panel. Sunum yapmak, birlikte çalışmak ve Canva tasarımlarını sınıfça incelemek için kullanılır.", pdf: "materyaller/panel.pdf" },
    { id: "sarj-dolabi",   alt: "sinif", ad: "Traulux Dizüstü Şarj Dolabı",   gorsel: "assets/img/araclar/sarj-dolabi.jpg", aciklama: "Otuz dizüstü bilgisayarı aynı anda saklayan ve şarj eden, sınıf içinde kolayca taşınabilen tekerlekli ve kilitli dolap.", pdf: "materyaller/sarj-dolabi.pdf" },
    { id: "omada",         alt: "sinif", ad: "TP-Link Omada EAP650 Erişim Noktası", gorsel: "assets/img/araclar/omada.jpg", aciklama: "Laboratuvarın Wi-Fi 6 kablosuz ağını yayan erişim noktası. Bilgisayarlar, etkileşimli panel ve IoT araçları internete bu cihaz üzerinden bağlanır.", pdf: "materyaller/omada.pdf" },
    { id: "yazici3b",      alt: "sinif", ad: "Elegoo Neptune 4 3B Yazıcı",    gorsel: "assets/img/araclar/yazici3b.jpg", aciklama: "Hızlı çalışan FDM tipi 3B yazıcı. Öğrencilerin tasarladığı parçalar, prototipler ve robot gövdeleri bu yazıcıda basılır.", pdf: "materyaller/yazici3b.pdf" },
    // Bilim ve Sürdürülebilirlik
    { id: "optika",        alt: "bilim", ad: "Optika B-190TBPL Dijital Mikroskop", gorsel: "assets/img/araclar/optika.jpg", aciklama: "Dokunmatik ekranlı ve kameralı öğretim mikroskobu. Görüntüyü ekrana aktararak bütün sınıfın aynı preparatı birlikte incelemesini sağlar.", pdf: "materyaller/optika.pdf" },
    { id: "usb-mikroskop", alt: "bilim", ad: "Taşınabilir USB Dijital Mikroskop", gorsel: "assets/img/araclar/usb-mikroskop.jpg", aciklama: "Bilgisayara bağlanan taşınabilir dijital mikroskop. Yaprak, kumaş ve böcek gibi örnekleri elde ya da standa takılı olarak büyütür ve fotoğraflar.", pdf: "materyaller/usb-mikroskop.pdf" },
    { id: "teleskop",      alt: "bilim", ad: "Bresser Spica 130/650 Teleskop", gorsel: "assets/img/araclar/teleskop.jpg", aciklama: "Ekvatoral kundaklı aynalı teleskop; Güneş filtresi ve akıllı telefon adaptörüyle gelir. Ay ve gezegen gözlemlerinin yanı sıra güvenli Güneş gözlemleri için de kullanılır.", pdf: "materyaller/teleskop.pdf" },
    { id: "enerji-kit",    alt: "bilim", ad: "Horizon Yenilenebilir Enerji Bilim Kiti", gorsel: "assets/img/araclar/enerji-kit.jpg", aciklama: "Güneş enerjisi, rüzgâr ve hidrojen yakıt piliyle küçük bir temiz enerji sistemi kuran deney kiti. 50'den fazla deney içerir.", pdf: "materyaller/enerji-kit.pdf" },
    { id: "enerji-olcum",  alt: "bilim", ad: "Horizon Yenilenebilir Enerji Ölçüm Cihazı", gorsel: "", aciklama: "Gerilim, akım, güç ve devir ölçen eğitim ölçüm cihazı. Yenilenebilir enerji deneylerindeki verileri bilgisayara aktarır.", pdf: "materyaller/enerji-olcum.pdf" },
    { id: "mobilite",      alt: "bilim", ad: "Horizon Elektrikli Mobilite Deney Seti", gorsel: "assets/img/araclar/mobilite.jpg", aciklama: "Altı farklı enerji kaynağıyla çalışan model araç seti. Yakıt pili, güneş paneli, süperkapasitör ve pilin verimini karşılaştırmayı sağlar.", pdf: "materyaller/mobilite.pdf" },
    { id: "lark",          alt: "bilim", ad: "DFRobot Lark Hava İstasyonu",   gorsel: "assets/img/araclar/lark.jpg", aciklama: "Rüzgâr, sıcaklık, nem ve basınç ölçen taşınabilir hava istasyonu. micro:bit, Arduino ve UNIHIKER ile programlanarak veri toplama projeleri yapılır.", pdf: "materyaller/lark.pdf" }
  ],

  /* Sınıf fotoğrafları: { src: "assets/img/galeri/1.jpg", baslik: "Genel görünüm" } */
  GALERI: [
    { src: "assets/img/galeri/sinif-01.jpg", baslik: "“Öğren, hayal et, oyna, keşfet!” duvarı ve çalışma alanı" },
    { src: "assets/img/galeri/sinif-02.jpg", baslik: "Laboratuvarın genel görünümü" },
    { src: "assets/img/galeri/sinif-03.jpg", baslik: "Grup çalışma masaları" },
    { src: "assets/img/galeri/sinif-04.jpg", baslik: "Ortak üretim alanı" },
    { src: "assets/img/galeri/sinif-05.jpg", baslik: "Bilgisayar istasyonları" },
    { src: "assets/img/galeri/sinif-06.jpg", baslik: "Canva duvarı ve etkileşimli panel" },
    { src: "assets/img/galeri/sinif-07.jpg", baslik: "Yeşil perde ve fotoğraf stüdyosu" },
    { src: "assets/img/galeri/sinif-08.jpg", baslik: "3B yazıcı köşesi" },
    { src: "assets/img/galeri/sinif-09.jpg", baslik: "Mikroskop çalışma alanı" },
    { src: "assets/img/galeri/sinif-10.jpg", baslik: "Teleskop ve stüdyo ışıkları" }
  ],

  /* 360° sahneler — Insta360 ile çekilen eş dikdörtgensel fotoğraf eklenince doldurun. Örnek:
     { id: "giris", baslik: "Laboratuvar girişi", gorsel: "assets/img/360/giris.jpg",
       sicakNoktalar: [{ pitch: -6, yaw: 0, metin: "Etkileşimli panel", arac: "panel" }] }
     360° sahneler (eş dikdörtgensel / equirectangular görsel, ör. Insta360 çıktısı).
     sicakNoktalar: görsel üzerindeki tıklanabilir noktalar.
       pitch: dikey açı (-90..90), yaw: yatay açı (-180..180),
       metin: üzerine gelince görünen yazı, arac: ARACLAR içindeki id               */
  SAHNELER: [
    { id: "sinif", baslik: "Laboratuvarın ortasından görünüm", gorsel: "assets/img/360/sinif-360.jpg",
      haov: 360, vaov: 80, sicakNoktalar: [] }
  ],

  /* Sınıf turu videosu (normal video). Boş bırakılırsa bölüm gizlenir. */
  TUR_VIDEO: { src: "assets/video/sinif-turu.mp4", kapak: "assets/video/sinif-turu-kapak.jpg" }
};
