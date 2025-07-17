import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Layout/Header'
import CategoryNavigation from './components/Layout/CategoryNavigation'
import ToolGrid from './components/Layout/ToolGrid'
import BackButton from './components/Layout/BackButton'
import FavoritesSection from './components/Layout/FavoritesSection'
import QRGenerator from './components/QRGenerator/QRGenerator'
import BatchQRGenerator from './components/QRGenerator/BatchQRGenerator'

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
    }
  ],
  text: [],
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
    </div>
  )
}

export default App 