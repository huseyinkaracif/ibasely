import { Routes, Route } from 'react-router-dom'

// Layout bileşenleri
import Header from './components/Layout/Header'

// Sayfa bileşenleri
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ToolPage from './pages/ToolPage'
import NotFoundPage from './pages/NotFoundPage'

// Araç bileşenleri
import QRGenerator from './components/QRGenerator/QRGenerator'
import BatchQRGenerator from './components/QRGenerator/BatchQRGenerator'
import BackgroundRemover from './components/QRGenerator/BackgroundRemover'
import TextAnalyzer from './components/QRGenerator/TextAnalyzer'
import TextTransformer from './components/QRGenerator/TextTransformer'
import TextDifference from './components/QRGenerator/TextDifference'

// Kategoriler ve araçlar - global export
export const categories = [
  {
    id: 'graphics',
    label: 'Grafik',
    icon: '🎨',
    description: 'Görsel içerik oluşturma ve düzenleme araçları'
  },
  {
    id: 'text',
    label: 'Metin',
    icon: '📝',
    description: 'Metin analizi, dönüştürme ve karşılaştırma araçları'
  },
  {
    id: 'generators',
    label: 'Oluşturucular',
    icon: '⚡',
    description: 'Çeşitli içerik oluşturucu araçları'
  },
  {
    id: 'formatters',
    label: 'Biçimlendiriciler',
    icon: '🔄',
    description: 'Veri biçimlendirme ve dönüştürme araçları'
  }
]

export const tools = {
  graphics: [
    {
      id: 'qr-generator',
      title: 'QR Kod Oluşturucu',
      description: 'URL ve metin için özelleştirilebilir QR kodlar oluşturun',
      icon: '📱',
      component: QRGenerator,
      category: 'graphics',
      tags: ['qr', 'kod', 'generator', 'url', 'wifi']
    },
    {
      id: 'batch-qr-generator',
      title: 'Toplu QR Oluşturucu',
      description: 'Birden fazla QR kod oluşturup ZIP dosyası olarak indirin',
      icon: '📋',
      component: BatchQRGenerator,
      category: 'graphics',
      tags: ['toplu', 'batch', 'qr', 'zip', 'çoklu']
    },
    {
      id: 'background-remover',
      title: 'Arka Plan Silici',
      description: 'AI ile resimlerinizden arka planı otomatik olarak silin',
      icon: '🎨',
      component: BackgroundRemover,
      category: 'graphics',
      tags: ['ai', 'arka plan', 'silici', 'resim', 'background']
    }
  ],
  text: [
    {
      id: 'text-analyzer',
      title: 'Metin Analizcisi',
      description: 'Detaylı metin analizi, kelime frekansı ve okunabilirlik raporu',
      icon: '📝',
      component: TextAnalyzer,
      category: 'text',
      tags: ['analiz', 'metin', 'istatistik', 'kelime', 'okuma']
    },
    {
      id: 'text-transformer',
      title: 'Metin Dönüştürücü',
      description: '20+ farklı format: camelCase, snake_case, Morse kodu ve daha fazlası',
      icon: '🔄',
      component: TextTransformer,
      category: 'text',
      tags: ['dönüştürme', 'case', 'format', 'morse', 'leet']
    },
    {
      id: 'text-difference',
      title: 'Metin Farkı Analizcisi',
      description: 'İki metin arasındaki farkları satır/kelime/karakter bazında analiz edin',
      icon: '📊',
      component: TextDifference,
      category: 'text',
      tags: ['fark', 'diff', 'karşılaştırma', 'git', 'analiz']
    }
  ],
  generators: [],
  formatters: []
}

// Tüm araçlar için birleştirilmiş liste
export const allTools = Object.values(tools).flat()

// Kategori adını al
export const getCategoryName = (categoryId) => {
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.label : 'Bilinmeyen Kategori'
}

// Aracı ID ile bul
export const getToolById = (toolId) => {
  return allTools.find(tool => tool.id === toolId)
}

// Kategori araçlarını al
export const getToolsByCategory = (categoryId) => {
  return tools[categoryId] || []
}

function App() {
  return (
    <div className="app">
      {/* Header her sayfada gösterilir */}
      <Header />
      
      {/* Main content area */}
      <main className="main-content">
        <Routes>
          {/* Ana sayfa */}
          <Route path="/" element={<HomePage />} />
          
          {/* Kategori sayfaları */}
          <Route path="/:category" element={<CategoryPage />} />
          
          {/* Araç sayfaları */}
          <Route path="/:category/:toolId" element={<ToolPage />} />
          
          {/* 404 sayfa */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <span>Made With </span>
            <span className="heart">❤️</span>
            <span> By </span>
            <a 
              href="https://www.linkedin.com/in/huseyin-karacif/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="developer-name"
            >
              Hüseyin Karacif
            </a>
            <span className="footer-divider">•</span>
            <a 
              href="https://buymeacoffee.com/hsynkrcf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="coffee-link"
            >
              ☕ Buy me a coffee
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App 