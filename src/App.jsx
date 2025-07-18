import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Layout/Header'
import CategoryNavigation from './components/Layout/CategoryNavigation'
import ToolGrid from './components/Layout/ToolGrid'
import BackButton from './components/Layout/BackButton'
import FavoritesSection from './components/Layout/FavoritesSection'
import QRGenerator from './components/QRGenerator/QRGenerator'
import BatchQRGenerator from './components/QRGenerator/BatchQRGenerator'
import BackgroundRemover from './components/QRGenerator/BackgroundRemover'
import TextAnalyzer from './components/QRGenerator/TextAnalyzer'
import TextTransformer from './components/QRGenerator/TextTransformer'
import TextDifference from './components/QRGenerator/TextDifference'

// Kategoriler ve araçlar
const categories = [
  {
    id: 'all',
    label: 'Tüm araçlar',
    icon: '🔧'
  },
  {
    id: 'graphics',
    label: 'Grafik',
    icon: '🎨'
  },
  {
    id: 'text',
    label: 'Metin',
    icon: '📝'
  },
  {
    id: 'generators',
    label: 'Oluşturucular',
    icon: '⚡'
  },
  {
    id: 'formatters',
    label: 'Biçimlendiriciler',
    icon: '🔄'
  }
]

const tools = {
  graphics: [
    {
      id: 'qr-generator',
      title: 'QR Kod Oluşturucu',
      description: 'URL ve metin için özelleştirilebilir QR kodlar oluşturun',
      icon: '📱',
      component: QRGenerator,
      category: 'graphics'
    },
    {
      id: 'batch-qr-generator',
      title: 'Toplu QR Oluşturucu',
      description: 'Birden fazla QR kod oluşturup ZIP dosyası olarak indirin',
      icon: '📋',
      component: BatchQRGenerator,
      category: 'graphics'
    },
    {
      id: 'background-remover',
      title: 'Arka Plan Silici',
      description: 'AI ile resimlerinizden arka planı otomatik olarak silin',
      icon: '🎨',
      component: BackgroundRemover,
      category: 'graphics'
    }
  ],
  text: [
    {
      id: 'text-analyzer',
      title: 'Gelişmiş Metin Analizcisi',
      description: 'Detaylı metin analizi, kelime frekansı ve okunabilirlik raporu',
      icon: '📝',
      component: TextAnalyzer,
      category: 'text'
    },
    {
      id: 'text-transformer',
      title: 'Gelişmiş Metin Dönüştürücü',
      description: '20+ farklı format: camelCase, snake_case, Morse kodu ve daha fazlası',
      icon: '🔄',
      component: TextTransformer,
      category: 'text'
    },
    {
      id: 'text-difference',
      title: 'Gelişmiş Metin Farkı Analizcisi',
      description: 'İki metin arasındaki farkları satır/kelime/karakter bazında analiz edin',
      icon: '📊',
      component: TextDifference,
      category: 'text'
    }
  ],
  generators: [],
  formatters: []
}

// Tüm araçlar için birleştirilmiş liste
const allTools = Object.values(tools).flat()

function App() {
  const [activeCategory, setActiveCategory] = useState(null) // null = ana kategoriler
  const [activeTool, setActiveTool] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState([])

  // LocalStorage'dan favorileri yükle
  useEffect(() => {
    const savedFavorites = localStorage.getItem('ibasely-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Favorileri localStorage'a kaydet
  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites)
    localStorage.setItem('ibasely-favorites', JSON.stringify(newFavorites))
  }

  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'all') {
      setActiveCategory('all')
    } else {
      setActiveCategory(categoryId)
    }
    setActiveTool(null)
    setSearchTerm('')
  }

  const handleToolSelect = (toolId) => {
    setActiveTool(toolId)
  }

  const handleBack = () => {
    if (activeTool) {
      setActiveTool(null)
    } else if (activeCategory) {
      setActiveCategory(null)
      setSearchTerm('')
    }
  }

  const toggleFavorite = (toolId) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId]
    saveFavorites(newFavorites)
  }

  const isFavorite = (toolId) => {
    return favorites.includes(toolId)
  }

  // Gösterilecek araçları belirle
  const getDisplayTools = () => {
    if (activeCategory === 'all') {
      return allTools
    } else if (activeCategory && tools[activeCategory]) {
      return tools[activeCategory]
    }
    return []
  }

  // Arama filtrelemesi
  const filteredTools = getDisplayTools().filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Favori araçları al
  const getFavoriteTools = () => {
    return allTools.filter(tool => favorites.includes(tool.id))
  }

  // Aktif araç component'ini bul
  const activeToolData = allTools.find(tool => tool.id === activeTool)
  const ActiveToolComponent = activeToolData?.component

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {/* Geri tuşu */}
          {(activeCategory || activeTool) && (
            <BackButton onClick={handleBack} />
          )}

          <AnimatePresence mode="wait">
            {activeTool ? (
              // Araç detay sayfası
              <motion.div
                key={`tool-${activeTool}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="tool-content"
              >
                {ActiveToolComponent && <ActiveToolComponent />}
              </motion.div>
            ) : activeCategory ? (
              // Araç grid sayfası
              <motion.div
                key={`category-${activeCategory}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ToolGrid
                  category={categories.find(cat => cat.id === activeCategory)}
                  tools={filteredTools}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onToolSelect={handleToolSelect}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              </motion.div>
            ) : (
              // Ana kategoriler sayfası
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CategoryNavigation
                  categories={categories}
                  onCategorySelect={handleCategorySelect}
                />
                
                {favorites.length > 0 && (
                  <FavoritesSection
                    favoriteTools={getFavoriteTools()}
                    onToolSelect={handleToolSelect}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
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