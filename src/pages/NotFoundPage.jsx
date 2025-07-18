import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'
import { categories, allTools } from '../App'
import './pages.css'

const NotFoundPage = () => {
  // Rastgele araç önerileri (3 tane)
  const randomTools = allTools
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  return (
    <div className="not-found-page">
      <div className="container">
        <motion.div
          className="not-found-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Hero */}
          <div className="not-found-hero">
            <div className="error-code">404</div>
            <h1 className="error-title">🤷‍♂️ Sayfa Bulunamadı</h1>
            <p className="error-description">
              Aradığınız sayfa bulunamadı. URL'yi kontrol edin veya ana sayfaya dönün.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="error-actions">
            <Link to="/" className="btn primary">
              <Home />
              Ana Sayfaya Dön
            </Link>
            <button 
              className="btn secondary"
              onClick={() => window.history.back()}
            >
              <ArrowLeft />
              Geri Git
            </button>
          </div>

          {/* Kategoriler */}
          <motion.div
            className="suggested-categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>📂 Kategorileri Keşfedin</h2>
            <div className="categories-grid">
              {categories.map(category => (
                <Link 
                  key={category.id}
                  to={`/${category.id}`}
                  className="category-card"
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.label}</h3>
                  <p>{category.description}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Önerilen Araçlar */}
          <motion.div
            className="suggested-tools"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2>🛠️ Popüler Araçlar</h2>
            <div className="tools-grid">
              {randomTools.map(tool => (
                <Link 
                  key={tool.id}
                  to={`/${tool.category}/${tool.id}`}
                  className="tool-card"
                >
                  <div className="tool-icon">{tool.icon}</div>
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  <div className="tool-category">
                    {categories.find(cat => cat.id === tool.category)?.label}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Yardım */}
          <motion.div
            className="help-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2>💡 Yardım</h2>
            <div className="help-grid">
              <div className="help-card">
                <Search className="help-icon" />
                <h3>Araç Ara</h3>
                <p>Ana sayfadaki arama kutusunu kullanarak istediğiniz aracı bulabilirsiniz.</p>
              </div>
              
              <div className="help-card">
                <Home className="help-icon" />
                <h3>Kategoriler</h3>
                <p>Araçlar kategorilere ayrılmıştır. İhtiyacınıza uygun kategoriyi seçin.</p>
              </div>
              
              <div className="help-card">
                <div className="help-icon">🔗</div>
                <h3>URL Yapısı</h3>
                <p>Araçlara doğrudan /kategori/araç şeklinde erişebilirsiniz.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFoundPage 