# Canva Tasarım Laboratuvarı — Web Sitesi

Bursa İl Millî Eğitim Müdürlüğü, Yenilik ve Eğitim Teknolojileri Hizmetleri Şubesi bünyesindeki Canva Tasarım Laboratuvarı için hazırlanan site. Öğretmenler sınıfı tanıyabilir, araçları inceleyebilir, sunuları indirebilir, randevu alabilir ve etkinlik sonrasında rapor gönderebilir.

## Sayfalar

| Dosya | İçerik |
|---|---|
| `index.html` | Ana sayfa |
| `sinifimiz.html` | Sınıf turu videosu, fotoğraf galerisi ve (görsel eklenince) 360° sanal tur |
| `araclar.html` | Ana malzemeler (5 alt sistem, filtre ve arama) |
| `materyaller.html` | Araç sunuları (PDF) |
| `randevu.html` | Randevu takvimi ve formu |
| `rapor.html` | Etkinlik rapor formu |
| `yonetim.html` | Yönetim paneli (şifreli) |
| `kvkk.html` | KVKK aydınlatma metni |

## Randevu kuralları

- Pazartesi–cuma günleri, iki oturum: **Sabah 09.30–12.30**, **Öğleden sonra 13.30–16.30**
- Her oturum tek gruba verilir; dolu oturumlar takvimde yalnızca "Dolu" görünür
- Bir öğretmen (aynı e-posta ya da telefon) bir hafta içinde yalnızca bir oturum alabilir
- En fazla **35 kişi**; üzerindeki sayılarda "sınıf kapasitesi yeterli değil" uyarısı verilir ve form gönderilmez
- Talepler "Beklemede" olarak düşer; yönetici onaylar ya da reddeder, öğretmene e-posta gider
- Sabit resmî tatiller kendiliğinden kapalıdır; dinî bayramlar ve diğer günler yönetim panelinden kapatılır
- Randevular en erken ertesi gün, en geç 8 hafta sonrası için alınabilir (`config.js` içinden değiştirilebilir)

## İçerik ekleme

Tüm içerik `assets/js/data.js` dosyasındadır:

- **Araç görseli ve açıklaması:** ilgili aracın `gorsel` ve `aciklama` alanları. Görselleri `assets/img/araclar/` klasörüne koyun.
- **Sunu PDF'leri:** PDF'i `materyaller/` klasörüne koyup aracın `pdf` alanına yolunu yazın (ör. `"materyaller/arduino-baslangic-kiti.pdf"`). Boş bırakılan araçlarda "Yakında" görünür.
- **Galeri:** `GALERI` listesine `{ src: "assets/img/galeri/1.jpg", baslik: "Genel görünüm" }` ekleyin.
- **Sınıf turu videosu:** `assets/video/` klasöründeki video `TUR_VIDEO` alanından gösterilir. Videoyu değiştirmek için aynı adla yeni dosya koymanız yeterli.
- **360° tur:** Insta360 ile çekilen panoramayı eş dikdörtgensel (equirectangular) JPG olarak dışa aktarın (2:1 oran, genişliği 4096 piksel önerilir). `assets/img/360/` klasörüne koyup `SAHNELER` listesine ekleyin. Şu anki 360° görsel, sınıfın ortasından çekilen 6 fotoğrafın birleştirilmesiyle hazırlandı (`haov: 360, vaov: 80`). Insta360 ile tek çekimde tam bir küre görüntüsü alırsanız `haov` ve `vaov` satırlarını silip yeni görseli koymanız yeterli. Tıklanabilir noktanın konumunu bulmak için `sinifimiz.html?konum` adresini açın ve görselde aracın üzerine tıklayın; ekranın altında `pitch` ve `yaw` değerleri görünür. Bu değerleri `sicakNoktalar` listesine yazın.
- **Logo:** `assets/img/logo.png` dosyasını eklemeniz yeterli.
- **Adres, iletişim, kapasite, oturum saatleri:** `assets/js/config.js`

## Çalışma modları

### 1. Önizleme (demo) modu
`config.js` içindeki `APPS_SCRIPT_URL` boşsa site demo modunda çalışır. Randevu ve raporlar yalnızca kullanılan tarayıcıda saklanır. Yönetim paneli şifresi: `demo1234`. GitHub Pages'te örnek göstermek için uygundur.

### 2. Gerçek kurulum (Google E-Tablolar + Apps Script)

1. Google Drive'da yeni bir E-Tablo oluşturun (ör. "Canva Lab Randevu Sistemi").
2. **Uzantılar > Apps Script** menüsünü açın. `apps-script/Code.gs` içeriğini düzenleyiciye yapıştırın.
3. **Proje Ayarları**'nda saat dilimini `(GMT+03:00) İstanbul` yapın.
4. Üstteki işlev listesinden `kurulum` işlevini seçip **Çalıştır**'a basın, izinleri verin. Bu işlem üç sayfayı (Randevular, Raporlar, Kapanislar) oluşturur.
5. **Proje Ayarları > Komut dosyası özellikleri** bölümünde:
   - `ADMIN_PASSWORD`: yönetim paneli şifresi (kurulumun oluşturduğu geçici şifreyi değiştirin)
   - `ADMIN_EMAIL`: yeni talep bildirimlerinin gideceği e-posta (isteğe bağlı)
6. **Dağıt > Yeni dağıtım > Web uygulaması**: "Şu kullanıcı olarak yürüt: Ben", "Erişimi olanlar: Herkes". Dağıtın ve verilen `/exec` adresini kopyalayın.
7. Bu adresi `assets/js/config.js` içindeki `APPS_SCRIPT_URL` alanına yapıştırın.

E-postalar, dağıtımı yapan Google hesabından gönderilir. Kişisel Gmail hesaplarında günlük gönderim sınırı yaklaşık 100 e-postadır.

`Code.gs` güncellendiğinde: **Dağıt > Dağıtımları yönet > Düzenle > Sürüm: Yeni sürüm**. Böylece adres değişmez.

## Kendi sitenize entegrasyon

- Arayüz düz HTML, CSS ve JavaScript'tir; derleme gerektirmez.
- Veri işlemleri yalnızca `assets/js/api.js` dosyasındadır. Kurumun kendi sunucusu kullanılacaksa bu dosyadaki `remote` bölümündeki beş işlev kendi API adreslerine yönlendirilir: `availability`, `createBooking`, `lookup`, `submitReport`, `admin`.
- Randevu kuralları hem `api.js` (`validateBooking`) hem `Code.gs` (`randevuDogrula`) içinde vardır; asıl denetim sunucu tarafındadır.

## Notlar

- KVKK metni taslaktır; yayından önce kurumun KVKK birimince gözden geçirilmelidir. Gözden geçirildikten sonra `kvkk.html` içindeki "Not: Bu metin taslaktır" kutusunu silin.
- Yönetim paneli adresi alt bilgide yer alır; şifre yalnızca sunucu tarafında doğrulanır.
