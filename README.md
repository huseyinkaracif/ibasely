# 🌟 IBASELY - Online Toolset

> Güzel tasarımlı kullanışlı online araçlar seti

[![PWA](https://img.shields.io/badge/PWA-Enabled-blue.svg)](https://web.dev/progressive-web-apps/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.5.0-green.svg)](https://vitejs.dev/)

## 📱 Özellikler

- **🎨 Modern Tasarım**: Çocuk dostu ve minimalist arayüz
- **📱 PWA Desteği**: Offline çalışabilir, cihaza yüklenebilir
- **⚡ Hızlı**: Vite ile optimize edilmiş performans
- **📱 Responsive**: Tüm cihazlarda mükemmel deneyim
- **🎯 QR Generator**: Anında QR kod oluşturma ve indirme

## 🛠️ Araçlar

### 📱 QR Kod Oluşturucu
- **Real-time Preview**: Anında QR kod önizlemesi
- **Multiple Formats**: PNG, JPG, SVG indirme seçenekleri
- **Customization**: Boyut, hata düzeltme seviyesi ayarları
- **Smart Detection**: URL/Metin otomatik algılama
- **Copy to Clipboard**: QR kod ve metin kopyalama

## 🚀 Kurulum

### Ön Koşullar
- Node.js 16.0+
- npm veya yarn

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/your-username/ibasely.git
cd ibasely
```

2. **Dependencies yükleyin**
```bash
npm install
```

3. **Development server başlatın**
```bash
npm run dev
```

4. **Tarayıcıda açın**
```
http://localhost:3000
```

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### PWA Test
```bash
npm run build
npm run preview
```
Lighthouse ile PWA skorunuzu kontrol edin.

## 🎨 Teknoloji Stack'i

### Core
- **React 18**: Modern React with Hooks
- **Vite**: Fast build tool and dev server
- **JavaScript**: ES6+ syntax

### PWA
- **Vite PWA Plugin**: Service Worker ve Manifest otomasyonu
- **Workbox**: Caching stratejileri

### UI/UX
- **Framer Motion**: Smooth animasyonlar
- **Lucide React**: Modern iconlar
- **Custom CSS**: CSS Variables ile tema sistemi

### Utilities
- **QRCode.js**: QR kod oluşturma
- **FileSaver.js**: Dosya indirme
- **React Hot Toast**: Bildirimler

## 📁 Proje Yapısı

```
ibasely/
├── public/                 # Static files
│   ├── icons/             # PWA icons
│   ├── manifest.json      # PWA manifest
│   └── index.html         # HTML template
├── src/
│   ├── components/        # React components
│   │   ├── Layout/        # Layout components
│   │   ├── QRGenerator/   # QR Generator
│   │   └── Common/        # Shared components
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   ├── assets/            # Images, fonts
│   ├── main.jsx           # App entry point
│   └── App.jsx            # Main App component
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── README.md             # Documentation
```

## 🎯 PWA Özellikleri

### ✅ Tamamlanan
- [x] Service Worker otomasyonu
- [x] Web App Manifest
- [x] Offline çalışabilirlik
- [x] Install prompt
- [x] Responsive design
- [x] Modern browser desteği

### 📱 Desteklenen Platformlar
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **PWA**: Windows, macOS, Linux, Android, iOS

## 🚀 Performance

### Hedef Metrics
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **PWA Score**: 90+

### Optimizasyonlar
- **Code Splitting**: Route bazlı lazy loading
- **Image Optimization**: Modern formatlar
- **Caching**: Aggressive service worker caching
- **Bundle Size**: < 1MB total

## 🔧 Geliştirme

### Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint check
```

### Code Style
- **ESLint**: Kod kalitesi kontrolü
- **Prettier**: Kod formatlama (önerilen)
- **Modern JS**: ES6+ features

### Contributing
1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Roadmap

### v1.1 - Gelecek Özellikler
- [ ] Renk Paleti Generator
- [ ] Basit Resim Düzenleyici
- [ ] QR kod renk özelleştirme
- [ ] Batch QR generation

### v1.2 - Advanced Features
- [ ] QR kod analitikleri
- [ ] Cloud sync (opsiyonel)
- [ ] API entegrasyonu
- [ ] Multi-language support

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Hüseyin Karacif**
- GitHub: [@huseyinkaracif](https://github.com/huseyinkaracif)
- Email: huseyin@example.com

## 🙏 Teşekkürler

- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [QRCode.js](https://github.com/soldair/node-qrcode) - QR code generation
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev/) - Icons

---

⭐ Bu projeyi beğendiyseniz star vermeyi unutmayın! 