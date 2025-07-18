import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Star, Grid, List } from 'lucide-react'
import { categories, getToolsByCategory, getCategoryName } from '../App'
import './pages.css'

const CategoryPage = () => {
  const { category: categoryId } = useParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' veya 'list'
  const [favorites, setFavorites] = useState([])

  // LocalStorage'dan favorileri yükle
  useEffect(() => {
    const savedFavorites = localStorage.getItem('ibasely-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Favorileri kaydet
  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites)
    localStorage.setItem('ibasely-favorites', JSON.stringify(newFavorites))
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

  // Kategori verilerini al
  const categoryData = categories.find(cat => cat.id === categoryId)
  const categoryTools = getToolsByCategory(categoryId)

  // Eğer kategori bulunamadıysa 404'e yönlendir
  if (!categoryData) {
    return (
      <div className="category-page error">
        <div className="container">
          <div className="error-content">
            <h1>🤷‍♂️ Kategori Bulunamadı</h1>
            <p>Aradığınız kategori mevcut değil.</p>
            <Link to="/" className="back-home-btn">Ana Sayfaya Dön</Link>
          </div>
        </div>
      </div>
    )
  }

  // Arama filtrelemesi
  const filteredTools = categoryTools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="category-page">
      <div className="container">
        {/* Simple Header */}
        <motion.div
          className="simple-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-controls">
            <button 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              <ArrowLeft />
              Ana Sayfa
            </button>
            
            <div className="search-section">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Araçlarda ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Araçlar */}
        <motion.div
          className="tools-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredTools.length > 0 ? (
            <>
              <div className="tools-header">
                <h2>
                  {searchTerm ? 
                    `🔍 Arama Sonuçları (${filteredTools.length})` : 
                    `🛠️ ${categoryData.label} Araçları`
                  }
                </h2>
              </div>
              
              <div className={`tools-container ${viewMode}`}>
                {filteredTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    className="tool-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <Link to={`/${categoryId}/${tool.id}`} className="tool-link">
                      <div className="tool-icon">{tool.icon}</div>
                      <h3 className="tool-title">{tool.title}</h3>
                      <p className="tool-description">{tool.description}</p>
                    </Link>
                    
                    <button
                      className={`favorite-btn ${isFavorite(tool.id) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(tool.id)}
                    >
                      <Star />
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-tools">
              {searchTerm ? (
                <div className="no-search-results">
                  <h3>🤷‍♂️ Arama sonucu bulunamadı</h3>
                  <p>"{searchTerm}" için {categoryData.label} kategorisinde araç bulunamadı.</p>
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    Aramayı Temizle
                  </button>
                </div>
              ) : (
                <div className="no-category-tools">
                  <h3>🚧 Henüz araç eklenmemiş</h3>
                  <p>{categoryData.label} kategorisinde henüz araç bulunmuyor.</p>
                  <p>Yakında yeni araçlar eklenecek!</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Diğer kategoriler önerisi */}
        {filteredTools.length === 0 && !searchTerm && (
          <motion.div
            className="other-categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3>🔍 Diğer Kategorilere Göz Atın</h3>
            <div className="categories-grid">
              {categories
                .filter(cat => cat.id !== categoryId)
                .map(category => (
                  <Link 
                    key={category.id} 
                    to={`/${category.id}`} 
                    className="category-card"
                  >
                    <div className="category-icon">{category.icon}</div>
                    <span className="category-name">{category.label}</span>
                  </Link>
                ))
              }
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage 