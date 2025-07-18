import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Star, ArrowRight } from 'lucide-react'
import { categories, allTools } from '../App'
import FavoritesSection from '../components/Layout/FavoritesSection'
import './pages.css'

const HomePage = () => {
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

  const toggleFavorite = (toolId) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId]
    saveFavorites(newFavorites)
  }

  const isFavorite = (toolId) => {
    return favorites.includes(toolId)
  }

  // Favori araçları al
  const getFavoriteTools = () => {
    return allTools.filter(tool => favorites.includes(tool.id))
  }

  // Arama sonuçları
  const searchResults = searchTerm.trim() ? 
    allTools.filter(tool =>
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : []

  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* Arama */}
          <div className="search-section">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Araç ara... (QR kod, metin analizi, arka plan silici...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Arama Sonuçları */}
        {searchTerm.trim() && (
          <motion.div
            className="search-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2>🔍 Arama Sonuçları ({searchResults.length})</h2>
            {searchResults.length > 0 ? (
              <div className="tools-grid">
                {searchResults.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    className="tool-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <Link to={`/${tool.category}/${tool.id}`} className="tool-link">
                      <div className="tool-icon">{tool.icon}</div>
                      <h3 className="tool-title">{tool.title}</h3>
                      <p className="tool-description">{tool.description}</p>
                      <div className="tool-category">
                        {categories.find(cat => cat.id === tool.category)?.label}
                      </div>
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
            ) : (
              <div className="no-results">
                <p>🤷‍♂️ Aradığınız kriterlere uygun araç bulunamadı.</p>
                <p>Farklı anahtar kelimeler deneyin.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Kategoriler - Sadece arama yoksa göster */}
        {!searchTerm.trim() && (
          <>
            <motion.div
              className="categories-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="categories-grid">
                {categories.map((category, index) => {
                  const categoryTools = allTools.filter(tool => tool.category === category.id)
                  
                  return (
                    <motion.div
                      key={category.id}
                      className="category-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                    >
                      <Link to={`/${category.id}`} className="category-link">
                        <div className="category-icon">{category.icon}</div>
                        <h3 className="category-title">{category.label}</h3>
                        <p className="category-description">{category.description}</p>
                        <div className="category-stats">
                          <span className="tools-count">{categoryTools.length} araç</span>
                          <ArrowRight className="arrow-icon" />
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Favoriler */}
            {favorites.length > 0 && (
              <motion.div
                className="favorites-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <FavoritesSection
                  favoriteTools={getFavoriteTools()}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              </motion.div>
            )}

          </>
        )}
      </div>
    </div>
  )
}

export default HomePage 