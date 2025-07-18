import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, Star, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getToolById, getCategoryName, categories, getToolsByCategory } from '../App'
import './pages.css'

const ToolPage = () => {
  const { category: categoryId, toolId } = useParams()
  const navigate = useNavigate()
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

  // Araç ve kategori verilerini al
  const tool = getToolById(toolId)
  const categoryName = getCategoryName(categoryId)
  const categoryData = categories.find(cat => cat.id === categoryId)

  // Eğer araç bulunamadıysa veya kategori uyuşmuyorsa 404
  if (!tool || tool.category !== categoryId) {
    return (
      <div className="tool-page error">
        <div className="container">
          <div className="error-content">
            <h1>🤷‍♂️ Araç Bulunamadı</h1>
            <p>Aradığınız araç mevcut değil veya yanlış kategoride.</p>
            <div className="error-actions">
              <Link to="/" className="btn primary">Ana Sayfa</Link>
              <Link to={`/${categoryId}`} className="btn secondary">
                {categoryName} Kategorisi
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const ToolComponent = tool.component

  return (
    <div className="tool-page">
      <div className="container">
        {/* Breadcrumb ve Header */}
        <motion.div
          className="tool-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Navigation */}
          <div className="tool-navigation">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-item">
                <Home size={16} />
                Ana Sayfa
              </Link>
              <span className="breadcrumb-separator">/</span>
              <Link to={`/${categoryId}`} className="breadcrumb-item">
                {categoryData?.icon} {categoryName}
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{tool.title}</span>
            </div>

            <div className="tool-actions">
              <Link to={`/${categoryId}`} className="back-to-category-btn">
                <ArrowLeft size={16} />
                {categoryName} Kategorisine Dön
              </Link>
              
              <Link to="/" className="back-to-home-btn">
                <Home size={16} />
                Ana Sayfaya Dön
              </Link>
              
              <button
                className={`favorite-btn ${isFavorite(toolId) ? 'active' : ''}`}
                onClick={() => toggleFavorite(toolId)}
                title={isFavorite(toolId) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              >
                <Star />
                {isFavorite(toolId) ? 'Favorilerde' : 'Favorile'}
              </button>
              
              <button
                className="share-btn"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: tool.title,
                      text: tool.description,
                      url: window.location.href
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link kopyalandı!')
                  }
                }}
                title="Paylaş"
              >
                <ExternalLink />
                Paylaş
              </button>
            </div>
          </div>

          {/* Tool Info */}
          <div className="tool-info">
            <div className="tool-icon-large">{tool.icon}</div>
            <div className="tool-details">
              <h1 className="tool-title">{tool.title}</h1>
              <p className="tool-description">{tool.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Tool Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <motion.div
            className="tool-tags-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>🏷️ Etiketler</h3>
            <div className="tool-tags">
              {tool.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tool Content */}
        <motion.div
          className="tool-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="tool-wrapper">
            {ToolComponent && <ToolComponent />}
          </div>
        </motion.div>

        {/* Related Tools */}
        <motion.div
          className="tool-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          
          {/* Tools suggestion from same category */}
          <div className="related-tools">
            <h3>🔗 Aynı Kategoriden Diğer Araçlar</h3>
            <div className="related-tools-grid">
                             {categoryData && 
                 tool.category === categoryId && 
                 categories.find(cat => cat.id === categoryId) &&
                 // Get other tools from same category (exclude current tool)
                 getToolsByCategory(categoryId)
                   .filter(t => t.id !== toolId)
                   .slice(0, 3)
                   .map(relatedTool => (
                  <Link 
                    key={relatedTool.id}
                    to={`/${categoryId}/${relatedTool.id}`}
                    className="related-tool-card"
                  >
                    <div className="related-tool-icon">{relatedTool.icon}</div>
                    <div className="related-tool-info">
                      <h4>{relatedTool.title}</h4>
                      <p>{relatedTool.description}</p>
                    </div>
                  </Link>
                ))
              }
              
                             {/* If no other tools, show link to category */}
               {getToolsByCategory(categoryId).filter(t => t.id !== toolId).length === 0 && (
                <div className="no-related-tools">
                  <p>Bu kategoride henüz başka araç bulunmuyor.</p>
                  <Link to={`/${categoryId}`} className="explore-category">
                    {categoryName} Kategorisini Keşfet
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ToolPage 