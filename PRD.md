# Ibasely Online Toolset - Product Requirements Document (PRD)

## 🎯 Proje Genel Bakış

**Proje Adı:** Ibasely
**Proje Tipi:** Frontend-only and support PWA (Progressive Web App)
**Teknoloji:** React + Vite

## 📋 Proje Kapsamı

### Ana Hedefler
- Güzel tasarımlı kullanışlı online araçlar seti
- Modern, minimalist ve çocuk dostu tasarım
- Offline çalışabilir PWA uygulaması
- Sadece frontend, veri depolama yok
- Mobil-first responsive tasarım

## 🎨 Tasarım Gereksinimleri

### Tasarım Prensipleri
- **Modern Minimalist:** Clean, sade arayüz
- **Çocuk Dostu:** Renkli, oyuncu ve eğlenceli öğeler
- **Akıcı:** Smooth animasyonlar ve transitions
- **Simülatif:** Gerçek zamanlı preview ve feedback
- **Erişilebilir:** Tüm yaş grupları için kullanılabilir

### Renk Paleti & Stil
- Çocuk oyuncağı temasına uygun pastel renkler
- Logo ile uyumlu renk şeması
- Yumuşak köşeler ve gölgeler
- Modern tipografi
- İkon kullanımı yaygın olacak

### Logo Entegrasyonu
- Tasarım renginde güzel bir font ile IBASELY yazacak
- Ibasely Marka kimliğini yansıtan tasarım öğeleri

## 🛠️ Teknoloji Stack'i

### Core Technologies
- **Frontend Framework:** React 18+
- **Build Tool:** Vite
- **PWA:** Service Worker, Web App Manifest
- **Styling:** CSS Modules / Styled Components / Tailwind CSS
- **Icons:** React Icons / Lucide React

### Özellik Kütüphaneleri
- **QR Code:** qrcode.js / qr-code-generator
- **File Download:** FileSaver.js
- **Animations:** Framer Motion
- **Toast Notifications:** React Hot Toast

## 📱 PWA Özellikleri

### Temel PWA Gereksinimleri
- **Offline Çalışabilirlik:** Service Worker ile cache
- **Install Prompt:** "Add to Home Screen" özelliği
- **Responsive:** Tüm cihazlarda çalışır
- **Fast Loading:** Optimized assets ve lazy loading
- **Web App Manifest:** Doğru metadata ve iconlar

### Performance
- First Contentful Paint < 2s
- Largest Contentful Paint < 3s
- Total Bundle Size < 1MB

## 🔧 Araçlar ve Özellikler

### v1.0 - İlk Versiyon

#### 1. QR Code Generator (Ana Araç)
**Tab Adı:** "QR Oluştur"

**Özellikler:**
- **Input Types:** 
  - Metin girişi
  - URL/Link girişi
  - Input validation ve formatlanma
- **Real-time Preview:** 
  - Anında QR code oluşturma
  - Live preview güncellemesi
- **Customization:**
  - QR kod boyutu seçimi
  - Error correction level seçimi
- **Export Options:**
  - PNG indirme (yüksek kalite)
  - JPG indirme (optimize edilmiş)
  - SVG indirme (scalable)
  - Dosya adı özelleştirme

**UI/UX Detayları:**
- Büyük, belirgin input alanı
- Real-time QR preview kartı
- İndirme butonları attractive tasarım
- Copy to clipboard özelliği
- Başarılı indirme feedback'i

### Gelecek Versiyonlar için Fikirler
- **v1.1:** Renk Paleti Generator
- **v1.2:** Basit Resim Düzenleyici
- **v1.3:** Basit Matematik Hesaplayıcıları
- **v1.4:** Eğitici Mini Oyunlar

## 📁 Proje Yapısı

```
isabel-qr/
├── public/
│   ├── icons/ (PWA icons)
│   ├── manifest.json
│   └── sw.js (Service Worker)
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   ├── QRGenerator/
│   │   └── Common/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── assets/
│   └── App.jsx
├── package.json
├── vite.config.js
└── README.md
```

## ✅ Kabul Kriterleri

### Teknik Kriterler
- [x] React + Vite ile kurulum tamamlandı
- [x] PWA özellikleri aktif (Service Worker, Manifest)
- [x] QR Code generation çalışıyor
- [x] Export (PNG, JPG, SVG) fonksiyonları çalışıyor
- [x] Responsive tasarım tamamlandı
- [ ] Cross-browser compatibility test edildi

### Tasarım Kriterleri
- [x] Çocuk dostu tema uygulandı
- [x] Logo entegrasyonu tamamlandı
- [x] Modern minimalist tasarım
- [x] Smooth animasyonlar eklendi
- [x] Erişilebilirlik standartları karşılandı

### Performance Kriterleri
- [ ] Lighthouse PWA skoru 90+
- [ ] Performance skoru 90+
- [ ] Accessibility skoru 90+
- [ ] Offline çalışabilirlik test edildi

## 🚀 Geliştirme Aşamaları

### Faz 1: Proje Kurulumu ✅ (Tamamlandı)
- ✅ Vite + React kurulumu
- ✅ PWA konfigürasyonu
- ✅ Temel klasör yapısı
- ✅ Dependencies yüklemeleri

### Faz 2: Layout ve Tasarım ✅ (Tamamlandı)
- ✅ Header/Navigation komponenti
- ✅ Logo entegrasyonu
- ✅ Tab yapısı kurulumu
- ✅ CSS framework/library kurulumu
- ✅ Responsive layout

### Faz 3: QR Generator Development ✅ (Tamamlandı)
- ✅ QR generation library entegrasyonu
- ✅ Input komponenti geliştirme
- ✅ Real-time preview özelliği
- ✅ Export functionality (PNG, JPG, SVG)
- ✅ UI polish ve animasyonlar

### Faz 4: PWA Optimizasyonu ✅ (Tamamlandı)
- ✅ Service Worker konfigürasyonu
- ✅ Web App Manifest düzenlemesi
- ✅ Offline functionality testing
- ✅ Performance optimizasyonu

### Faz 5: Testing & Deployment 🔄 (Başlatılabilir)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] PWA functionality verification
- [ ] Final polish ve bug fixes

## 📊 Success Metrics

- **User Engagement:** QR codes generated per session
- **Technical Performance:** Load time, PWA score
- **User Experience:** Task completion rate
- **Device Coverage:** Mobile/Desktop usage balance


**Proje Sahibi:** Hüseyin Karacif
**Geliştirici:** Hüseyin Karacif
**Başlangıç Tarihi:** 18.07.2025
**Hedef Tamamlanma:** 18.07.2025