# 🏆 Discord Çoklu Kanal Canlı Maç & TV Yayını Botu

Discord ses kanallarında **beIN SPORTS**, **TRT 1**, **Canlı Maçlar** ve özel `.m3u8` linklerini gerçek zamanlı, sıfır gecikmeli, ses ve görüntü senkronizasyonu tam olarak yayınlayan çoklu hesaplı canlı yayın botu.

---

## ✨ Özellikler

- 📺 **Eşzamanlı Çoklu Yayın:** Farklı ses odalarında aynı anda TRT 1 ve beIN SPORTS yayınlayabilme.
- ⚡ **Sıfır Gecikme & Kesintisiz Canlı Döngü:** HLS akışlarını kopmadan 7/24 canlı yayınlar.
- 🛡️ **Free / Nitro'suz Hesap Uyumu:** 1800 kbps sabit bitrate (CBR) ile Discord'un paket engeline takılmadan akıcı 720p HD @ 30 FPS.
- 🔊 **Milimetrik Ses/Görüntü Senkronizasyonu:** Göreceli PTS eşleme ile ses kayması sıfırlanmıştır.
- 🔒 **Yetki Koruması:** `!durdur` komutunu yalnızca belirlediğiniz sahip kullanabilir.
- ☁️ **Render.com / VPS Uyumlu:** `ffmpeg-static` ve dinamik `PORT` desteği ile bulutta tek tıkla çalışır.

---

## 📋 Komutlar

| Komut | Açıklama |
|---|---|
| `!yayin bein1` | beIN SPORTS 1 HD canlı maç yayınını başlatır |
| `!yayin trt1` | TRT 1 HD / Tabii yayınını başlatır |
| `!yayin test3` | Özel canlı maç akışını başlatır |
| `!yayin_link <url>` | Herhangi bir `.m3u8` linkini doğrudan yayına verir |
| `!kanallar` | İzlenebilir tüm TV ve Spor kanallarını listeler |
| `!maclar` | Sitedeki güncel canlı maçları anlık listeler |
| `!ses <0-200>` | Yayın ses seviyesini ayarlar |
| `!durum` | Aktif yayın yapan botların ve kanalların durumunu gösterir |
| `!durdur` | Tüm aktif yayınları durdurur ve ses kanalından ayrılır *(Yalnızca @efe_tr_24)* |

---

## 🚀 Yerel Kurulum

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. .env dosyanızı oluşturup tokenlerinizi girin
cp .env.example .env

# 3. Botu başlatın
npm start
```

---

## ☁️ Render.com Üzerinde 7/24 Çalıştırma

1. GitHub deponuzu [Render.com](https://render.com) hesabınıza bağlayın.
2. **New ➔ Web Service** seçeneğini seçin.
3. Ayarları yapılandırın:
   - **Environment:** `Node`
   - **Region:** `Frankfurt (EU-Central)` *(En düşük Discord pingi için)*
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. **Environment Variables** kısmına şunları ekleyin:
   - `TRT_TOKEN` = `hesap_tokeniniz`
   - `BEIN_TOKEN` = `ikinci_hesap_tokeniniz`
   - `PREFIX` = `!`
5. Servis açıldıktan sonra Render'ın verdiği URL'yi [cron-job.org](https://cron-job.org) veya [UptimeRobot](https://uptimerobot.com) üzerine ekleyerek her 5 dakikada bir ping atmasını sağlayın *(Uyku moduna geçmesini engeller)*.

---

## 📄 Lisans
MIT
